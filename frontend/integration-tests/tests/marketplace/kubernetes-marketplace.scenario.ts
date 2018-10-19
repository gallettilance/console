/* eslint-disable no-undef, no-unused-vars */

import { browser, $, ExpectedConditions as until } from 'protractor';

import { appHost, checkLogs, checkErrors, testName } from '../../protractor.conf';
import * as marketplaceView from '../../views/kubernetes-marketplace.view';
import * as sidenavView from '../../views/sidenav.view';

describe('Viewing the operators in Kubernetes Marketplace', () => {
  const openCloudServices = new Set(['etcd', 'prometheus']);

  beforeAll(async() => {
    browser.get(`${appHost}/status/ns/${testName}`);
    await browser.wait(until.presenceOf($('#sidebar')));
  });

  afterEach(() => {
    checkLogs();
    checkErrors();
  });

  it('displays Kubernetes Marketplace with expected available operators', async() => {
    await sidenavView.clickNavLink(['Operators', 'Kubernetes Marketplace']);
    await marketplaceView.isLoaded();

    openCloudServices.forEach(name => {
      expect(marketplaceView.entryTileFor(name).isDisplayed()).toBe(true);
    });
  });

  it('displays etcd operator when filter "CoreOS, Inc" is active', async() => {
    await marketplaceView.clickFilterCheckbox('CoreOS');

    expect(marketplaceView.entryTileFor('etcd').isDisplayed()).toBe(true);

    // Cleanup
    await marketplaceView.clickFilterCheckbox('CoreOS');
  });

  it('does not display etcd operator when filter "Red Hat, Inc." is active', async() => {
    await marketplaceView.clickFilterCheckbox('Red Hat');

    expect(marketplaceView.entryTileCount('etcd')).toBe(0);

    // Cleanup
    await marketplaceView.clickFilterCheckbox('Red Hat');
  });

  it('displays "prometheus" as an operator when using the filter "p"', async() => {
    await marketplaceView.filterByName('p');

    expect(marketplaceView.entryTileFor('prometheus').isDisplayed()).toBe(true);

    // Cleanup
    await marketplaceView.filterByName('');
  });

  it('displays "Clear All Filters" when filters have no results', async() => {
    await marketplaceView.filterByName('NoOperatorsTest');

    expect(marketplaceView.entryTiles.count()).toBe(0);
    expect(marketplaceView.clearFiltersText.isDisplayed()).toBe(true);
  });

  it('clears all filters when "Clear All Filters" text is clicked', async() => {
    await marketplaceView.clearFiltersText.click();

    expect(marketplaceView.filterTextbox.getAttribute('value')).toEqual('');
    expect(marketplaceView.activeFilterCheckboxes.count()).toBe(0);

    // All tiles should be displayed
    openCloudServices.forEach(name => {
      expect(marketplaceView.entryTileFor(name).isDisplayed()).toBe(true);
    });
  });

  // Test MarketplaceModalOverlay for each operator
  openCloudServices.forEach(name => {
    it('displays modal overlay with correct content when ' + name + ' operator is clicked', async() => {
        marketplaceView.entryTileFor(name).click();
        await marketplaceView.operatorModalIsLoaded();

        expect(marketplaceView.operatorModal.isDisplayed()).toBe(true);
        expect(marketplaceView.operatorModalTitle.getText()).toEqual(name);

        await marketplaceView.closeOperatorModal();
        await marketplaceView.operatorModalIsClosed();
    });
  });

});
