import * as React from 'react';
import * as _ from 'lodash-es';
import * as PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

import {Firehose, PageHeading, StatusBox} from '../utils';
import {k8sCreate, referenceForModel} from '../../module/k8s';
import {CatalogSourceConfigModel, PackageManifestModel} from '../../models';
import {MarketplaceTileViewPage} from './kubernetes-marketplace-items';
import {MarketplaceModalOverlay} from './modal-overlay';
import {AdminSubscribe} from './kubernetes-marketplace-subscribe'

const normalizePackageManifests = (packageManifests, kind) => {
  const activePackageManifests = _.filter(packageManifests, packageManifest => {
    return !packageManifest.status.removedFromBrokerCatalog;
  });
  return _.map(activePackageManifests, packageManifest => {
    const name = packageManifest.metadata.name;
    const defaultIconClass = 'fa fa-clone'; // TODO: get this info from the packagemanifest
    const iconObj = _.get(packageManifest, 'status.channels[0].currentCSVDesc.icon[0]');
    const imgUrl = iconObj && `data:${iconObj.mediatype};base64,${iconObj.base64data}`;
    const iconClass = imgUrl ? null : defaultIconClass;
    const description = packageManifest.metadata.description;
    const provider = _.get(packageManifest, 'metadata.labels.provider');
    const tags = packageManifest.metadata.tags;
    const version = _.get(packageManifest, 'status.channels[0].currentCSVDesc.version');
    const currentCSVAnnotations = _.get(packageManifest, 'status.channels[0].currentCSVDesc.annotations', {});
    const { description, certifiedLevel, healthIndex, repository, containerImage, createdAt, support, packageId } = currentCSVAnnotations;
    return {
      obj: packageManifest,
      kind,
      name,
      iconClass,
      imgUrl,
      description,
      provider,
      tags,
      version,
      certifiedLevel,
      healthIndex,
      repository,
      containerImage,
      createdAt,
      support,
      packageId,
    };
  });
};

const getItems = (props) => {
  const {packagemanifests, loaded} = props;
  let packageManifestItems = null;
  if (!loaded || !packagemanifests) {
    return [];
  }
  packageManifestItems = normalizePackageManifests(packagemanifests.data, 'PackageManifest');
  return _.sortBy([...packageManifestItems], 'name');
};

export class MarketplaceListPage extends React.Component {
  constructor() {
    super();
    this.state = {
      selectedTile: null,
      showSubscribe: null,
    };
  }

  static getDerivedStateFromProps(props, state) {
    const {packagemanifests} = props;
    if (packagemanifests !== state.packagemanifests) {
      const items = getItems(props);
      return {items, packagemanifests};
    }
  }

  toggleOpen(item) {
    this.setState(prevState => {
      const selectedTile = prevState.selectedTile === item ? null : item;
      return { selectedTile };
    });
  }

  subscribe(targetNamespace) {
    // Subscribe to operator by creating catalogSourceConfig in a given namespace
    const {name, packageId} = this.state.selectedTile;
    console.log(packageId);
    const catalogSourceConfig = {
      apiVersion: 'marketplace.redhat.com/v1alpha1',
      kind: 'CatalogSourceConfig',
      metadata: {
        name: `${name}`,
        namespace: "marketplace",
      },
      spec: {
        targetNamespace: `${targetNamespace}`,
        packages: `${packageId}`,
      },
    };

    // This returns a promise, should add some error checking on this
    k8sCreate(CatalogSourceConfigModel, catalogSourceConfig);

    this.hideSubscribePage();
  }

  hideSubscribePage() {
    this.setState({
      showSubscribe : null,
      selectedTile: null
    })
  }

  showSubscribePage() {
    this.setState({
      showSubscribe : true
    })
  }

  render() {
    const {loaded, loadError} = this.props;
    const {items, selectedTile, showSubscribe} = this.state;
    return (
    showSubscribe ?
      <AdminSubscribe item={selectedTile} close={() => this.hideSubscribePage()} subscribe={(targetNamespace) => this.subscribe(targetNamespace)}/>
      :
      <React.Fragment>
        <Helmet>
          <title>Kubernetes Marketplace</title>
        </Helmet>
        <div className="co-catalog">
        <PageHeading title="Kubernetes Marketplace" />
        <StatusBox data={items} loaded={loaded} loadError={loadError} label="Resources">
          <MarketplaceTileViewPage items={items} toggleOpen={(item) => this.toggleOpen(item)} />
          {selectedTile &&
          <MarketplaceModalOverlay item={selectedTile} close={() => this.toggleOpen(null)} openSubscribe={() => this.showSubscribePage()} />}
        </StatusBox>
        </div>
      </React.Fragment>
    )
  }
}
MarketplaceListPage.displayName = 'MarketplaceList';
MarketplaceListPage.propTypes = {
  obj: PropTypes.object,
};

export const Marketplace = () => {
  const resources = [];
  resources.push({
    isList: true,
    kind: referenceForModel(PackageManifestModel),
    namespace: 'marketplace',
    prop: 'packagemanifests'
  });
  return <Firehose resources={resources}>
    <MarketplaceListPage />
  </Firehose>;
};
Marketplace.displayName = 'Marketplace';

export const MarketplacePage = () => {
  return <Marketplace />
};
