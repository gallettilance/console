import * as React from 'react';
//import { create } from 'react-test-renderer';
import { shallow } from 'enzyme';

//import {CatalogTileView} from '../../node_modules/patternfly-react-extensions/dist/js/components/CatalogTileView';
//import {CatalogTile} from '../../node_modules/patternfly-react-extensions/dist/js/components/CatalogTile';
//import {FilterSidePanel} from '../../node_modules/patternfly-react-extensions/dist/js/components/FilterSidePanel';
//import Modal from 'patternfly-react/dist/esm/components/Modal/Modal';

import { MarketplaceListPage } from '../../public/components/marketplace/kubernetes-marketplace';
import { MarketplaceTileViewPage } from '../../public/components/marketplace/kubernetes-marketplace-items';
//import { MarketplaceModalOverlay } from '../../public/components/marketplace/modal-overlay';
import { marketplaceListPageProps } from '../../__mocks__/marketplaceItemsMocks';
//import * as _ from 'lodash-es';

// TODO: snapshot test once VerticalTabs and Categories are added

// test normalizePackageManifests in MarketplaceListPage
describe(MarketplaceListPage.displayName, () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<MarketplaceListPage {...marketplaceListPageProps} />);
  });

  it('normalizes items for marketplace', () => {
    const tileViewPage = wrapper.find(MarketplaceTileViewPage);
    expect(tileViewPage.exists()).toBe(true);

    // test that each item's name, iconClass, imgUrl, description, provider, etc
    // were set correctly before being passed to MarketplaceTileViewPage
    //expect(tileViewPage.at(0).props().items).toEqual(marketplaceItems);
  });
});

// test filter rendering

// test tile rendering (David tests both number of tiles and a specific tile, we should too!)

// test modal overlay (can I get it to render? how to click or interact with jest...)
// maybe just render the component by itself
