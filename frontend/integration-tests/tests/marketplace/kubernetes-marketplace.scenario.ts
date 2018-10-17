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

  it('displays MarketplaceModalOverlay when an operator is clicked', async() => {
    openCloudServices.forEach(name => {
      await marketplaceView.openOperatorModalFor(name);
      await marketplaceView.operatorModalIsLoaded();

      expect(marketplaceView.operatorModal().isDisplayed()).toBe(true);
      
      await marketplaceView.closeOperatorModal();
      await marketplaceView.operatorModalIsClosed();
    });
  });
});
