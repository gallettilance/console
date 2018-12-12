import * as React from 'react';
import * as _ from 'lodash-es';
import * as PropTypes from 'prop-types';
import {Helmet} from 'react-helmet';

import {Firehose, PageHeading, StatusBox} from '../utils';
import {referenceForModel} from '../../module/k8s';
import {PackageManifestModel, DeploymentModel, OperatorGroupModel, CatalogSourceConfigModel} from '../../models';
import {MarketplaceTileViewPage} from './kubernetes-marketplace-items';
import * as operatorImg from '../../imgs/operator.svg';

const normalizePackageManifests = (packageManifests, kind) => {
  const activePackageManifests = _.filter(packageManifests, packageManifest => {
    return !packageManifest.status.removedFromBrokerCatalog;
  });
  return _.map(activePackageManifests, packageManifest => {
    const name = packageManifest.metadata.name;
    const uid = `${name}/${packageManifest.status.catalogSourceNamespace}`;
    const defaultIconClass = 'fa fa-clone';
    const iconObj = _.get(packageManifest, 'status.channels[0].currentCSVDesc.icon[0]');
    const imgUrl = iconObj ? `data:${iconObj.mediatype};base64,${iconObj.base64data}` : operatorImg;
    const iconClass = imgUrl ? null : defaultIconClass;
    const provider = _.get(packageManifest, 'metadata.labels.provider');
    const tags = packageManifest.metadata.tags;
    const version = _.get(packageManifest, 'status.channels[0].currentCSVDesc.version');
    const currentCSVAnnotations = _.get(packageManifest, 'status.channels[0].currentCSVDesc.annotations', {});
    let {
      description,
      certifiedLevel,
      healthIndex,
      repository,
      containerImage,
      createdAt,
      support,
      longDescription,
      categories,
    } = currentCSVAnnotations;
    const categoryArray = categories && _.map(categories.split(','), category => category.trim());
    longDescription = longDescription ? longDescription : _.get(packageManifest, 'status.channels[0].currentCSVDesc.description');
    const catalogSource = _.get(packageManifest, 'status.catalogSource');
    const catalogSourceNamespace = _.get(packageManifest, 'status.catalogSourceNamespace');
    return {
      obj: packageManifest,
      kind,
      name,
      uid,
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
      longDescription,
      categories: categoryArray,
      catalogSource,
      catalogSourceNamespace,
    };
  });
};

const isMarketplaceRunning = (deployments) => {
  const items = _.reduce(deployments.data, (acc, dep) => {
    const name = _.get(dep, 'metadata.name', false);
    if (name) {
      acc.push(name);
    }
    return acc;
  }, []);
  return _.includes(items, 'marketplace-operator');
};

const getItems = (props) => {
  const {deployments, packagemanifests, loaded} = props;
  if (!loaded || !deployments || !packagemanifests){
    return [];
  }
  if (!isMarketplaceRunning(deployments)) {
    return [];
  }
  let packageManifestItems = null;
  packageManifestItems = _.filter(packagemanifests.data, (packageManifest) => {
    // temporary - real fix involves filtering for a specific visibility label
    const label = _.get(packageManifest, 'status.channels[0].currentCSVDesc.annotations.description');
    return label;
  });
  if (_.isEmpty(packageManifestItems)) {
    return [];
  }
  packageManifestItems = normalizePackageManifests(packageManifestItems, 'PackageManifest');
  return _.sortBy([...packageManifestItems], 'name');
};

export class MarketplaceListPage extends React.Component {
  constructor() {
    super();
    this.state = {
      selectedItem: null,
    };
  }

  static getDerivedStateFromProps(props, state) {
    const {packagemanifests} = props;
    if (packagemanifests !== state.packagemanifests) {
      const items = getItems(props);
      return {items, packagemanifests};
    }
    return {};
  }

  render() {
    const {catalogsourceconfigs, loaded, loadError} = this.props;
    const {items} = this.state;
    return <StatusBox data={items} loaded={loaded} loadError={loadError} label="Resources" EmptyMsg={'Please check that the marketplace operator is running. If you are using your own quay.io appregistry, please ensure your operators are properly documented. For more information visit https://github.com/operator-framework/operator-marketplace'} >
      <MarketplaceTileViewPage items={items} />
    </StatusBox>;
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
    kind: referenceForModel(DeploymentModel),
    namespace: 'openshift-operators',
    prop: 'deployments',
  });
  resources.push({
    isList: true,
    kind: referenceForModel(CatalogSourceConfigModel),
    namespace: 'openshift-operators',
    prop: 'catalogsourceconfigs',
  });
  resources.push({
    isList: true,
    kind: referenceForModel(OperatorGroupModel),
    prop: 'operatorgroups',
  });
  resources.push({
    isList: true,
    kind: referenceForModel(PackageManifestModel),
    namespace: 'openshift-operators',
    prop: 'packagemanifests',
  });
  return <Firehose resources={resources} className="co-catalog-connect">
    <MarketplaceListPage />
  </Firehose>;
};
Marketplace.displayName = 'Marketplace';

export const MarketplacePage = () => {
  return <React.Fragment>
    <Helmet>
      <title>Kubernetes Marketplace</title>
    </Helmet>
    <div className="co-catalog">
      <PageHeading title="Kubernetes Marketplace" />
      <Marketplace />
    </div>
  </React.Fragment>;
};
