import * as React from 'react';
import * as _ from 'lodash-es';
import * as PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import {CatalogTileView} from 'patternfly-react-extensions/dist/esm/components/CatalogTileView';
import {CatalogTile} from 'patternfly-react-extensions/dist/esm/components/CatalogTile';

import {Firehose, PageHeading, StatusBox} from '../utils';
import {referenceForModel} from '../../module/k8s';
import {PackageManifestModel} from '../../models';
import {MarketplaceTileViewPage} from './kubernetes-marketplace-items';
import {MarketplaceItemModal} from './modal-overlay';
import {AdminSubscribe} from './kubernetes-marketplace-subscribe'
import {MarketplaceTileViewPage} from './kubernetes-marketplace-items';

const normalizePackageManifests = (packageManifests, kind) => {
  const activePackageManifests = _.filter(packageManifests, packageManifest => {
    return !packageManifest.status.removedFromBrokerCatalog;
  });
  return _.map(activePackageManifests, packageManifest => {
    const name = packageManifest.metadata.name;
    const uid = `${name}/${packageManifest.status.catalogSourceNamespace}`;
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
      selectedItem: null,
    };
  }

  static getDerivedStateFromProps(props, state) {
    const {packagemanifests} = props;
    if (packagemanifests !== state.packagemanifests) {
      const items = getItems(props);
      return {items, packagemanifests};
    }
  }

  openOverlay(item) {
    this.setState({
      selectedItem : item
    });
  }

  closeOverlay() {
    this.setState({
      selectedItem : null
    });
  }

  render() {
    const {loaded, loadError} = this.props;
    const {items, selectedItem} = this.state;
    return <StatusBox data={items} loaded={loaded} loadError={loadError} label="Resources">
      <MarketplaceTileViewPage items={items} openOverlay={(item) => this.openOverlay(item)} />
      {selectedItem &&
      <MarketplaceItemModal item={selectedItem} close={() => this.closeOverlay()}/>}
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
  return <React.Fragment>
    <Helmet>
      <title>Kubernetes Marketplace</title>
    </Helmet>
    <div className="co-catalog">
      <PageHeading title="Kubernetes Marketplace" />
      <Marketplace />
    </div>
    </React.Fragment>
};
