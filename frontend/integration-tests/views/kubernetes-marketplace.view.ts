/* eslint-disable no-undef, no-unused-vars */

import { browser, $, $$, ExpectedConditions as until } from 'protractor';

export const entryTiles = $$('.catalog-tile-pf');
export const entryTileFor = (name: string) => entryTiles.filter((tile) => tile.$('.catalog-tile-pf-title').getText()
  .then(text => text === name)).first();

export const openOperatorModalFor = (name: string) => entryTileFor(name).click();
export const operatorModalIsLoaded = () => browser.wait(until.presenceOf($('.modal-content')), 1000)
  .then(() => browser.sleep(500));

export const operatorModal = () => $('.modal-content');
export const closeOperatorModal = () => operatorModal().$('.close').click();
export const marketplaceView.operatorModalIsClosed = () => browser.wait(until.not(until.presenceOf($('.modal-content'))), 1000)
  .then(() => browser.sleep(500));

export const isLoaded = () => browser.wait(until.presenceOf($('.loading-box__loaded')), 10000).then(() => browser.sleep(500));
