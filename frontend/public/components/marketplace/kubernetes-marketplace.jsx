import * as React from 'react';
import * as _ from 'lodash-es';
import * as PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

import { FLAGS, connectToFlags, flagPending } from '../../features';
import { Firehose, NavTitle, StatusBox } from '../utils';
import { CatalogTileViewPage } from '../catalog-items';
import { getMostRecentBuilderTag, getAnnotationTags, isBuilder} from '../image-stream';
import { serviceClassDisplayName, referenceForModel } from '../../module/k8s';
import { getServiceClassIcon, getServiceClassImage, getImageStreamIcon, getImageForIconClass } from '../catalog-item-icon';
import { PackageManifestModel } from '../../models';

class CatalogListPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
    };
  }

  componentDidUpdate(prevProps) {
    const {clusterserviceclasses, imagestreams, packagemanifests, namespace} = this.props;
    if (packagemanifests !== prevProps.packagemanifests ||
      namespace !== prevProps.namespace ||
      clusterserviceclasses !== prevProps.clusterserviceclasses ||
      imagestreams !== prevProps.imagestreams) {
      this.createCatalogData();
    }
  }

  createCatalogData() {
    const {clusterserviceclasses, imagestreams, packagemanifests, loaded} = this.props;
    let clusterServiceClassItems = null, imageStreamsItems = null, packageManifestItems = null;

    if (!loaded) {
      return;
    }

    if (packagemanifests) {
      packageManifestItems = this.normalizePackageManifests(packagemanifests.data, 'PackageManifest');
    }

    const items = _.sortBy([...packageManifestItems], 'tileName');

    this.setState({items});
  }


  normalizePackageManifests(packageManifests, kind) {
    const activePackageManifests = _.filter(packageManifests, packageManifest => {
      return !packageManifest.status.removedFromBrokerCatalog;
    });

    return _.map(activePackageManifests, packageManifest => {
      const tileName = packageManifest.metadata.name;
      const iconClass = getServiceClassIcon(packageManifest);
      const tileImgUrl = getServiceClassImage(packageManifest, iconClass);
      const tileIconClass = tileImgUrl ? null : iconClass;
      const tileDescription = packageManifest.metadata.description;
      const tileProvider = packageManifest.metadata.labels.provider;
      const tags = packageManifest.metadata.tags;
      const { name, namespace } = packageManifest.metadata;
      const href = `packages.app.redhat.com/v1alpha1/cluster/packagemanifests/${name}/create-instance?preselected-ns=${namespace}`;
      console.log(packageManifest);
      return {
        obj: packageManifest,
        kind,
        tileName,
        tileIconClass,
        tileImgUrl,
        tileDescription,
        tileProvider,
        href,
        tags,
      };
    });
  }

  render() {
    const { loaded, loadError } = this.props;
    const { items } = this.state;

    return <StatusBox data={items} loaded={loaded} loadError={loadError} label="Resources">
      <CatalogTileViewPage items={items} />
    </StatusBox>;
  }
}

CatalogListPage.displayName = 'CatalogList';

CatalogListPage.propTypes = {
  obj: PropTypes.object,
  namespace: PropTypes.string,
};

// eventually may use namespace
// eslint-disable-next-line no-unused-vars
export const Marketplace = connectToFlags(FLAGS.OPENSHIFT, FLAGS.SERVICE_CATALOG)(({namespace, flags}) => {

  if (flagPending(flags.OPENSHIFT) || flagPending(flags.SERVICE_CATALOG)) {
    return null;
  }

  const resources = [];

  resources.push({
    isList: true,
    kind: referenceForModel(PackageManifestModel),
    namespace: 'kube-system',
    prop: 'packagemanifests'
  });

  return <Firehose resources={resources}>
    <CatalogListPage namespace={namespace} />
  </Firehose>;
});

Marketplace.displayName = 'Marketplace';

Marketplace.propTypes = {
  namespace: PropTypes.string,
};

export const MarketplacePage = ({match}) => {
  const namespace = _.get(match, 'params.ns');
  return <React.Fragment>
    <Helmet>
      <title>Kubernetes Marketplace</title>
    </Helmet>
    <div className="co-catalog">
      <NavTitle title="Kubernetes Marketplace" />
      <Marketplace namespace={namespace} />
    </div>
  </React.Fragment>;
};
