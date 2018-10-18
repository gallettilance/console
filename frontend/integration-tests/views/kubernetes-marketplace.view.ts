/* eslint-disable no-undef, no-unused-vars */

import { browser, $, $$, ExpectedConditions as until } from 'protractor';

export const entryTiles = $$('.catalog-tile-pf');
export const entryTileFor = (name: string) => entryTiles.filter((tile) => tile.$('.catalog-tile-pf-title').getText()
  .then(text => text === name)).first();
export const entryTileCount = (name: string) => entryTiles.filter((tile) => tile.$('.catalog-tile-pf-title').getText()
  .then(text => text === name)).count();

// FilterSidePanel views
export const filterCheckboxes = $$('.filter-panel-pf-category-item');
// Using string  includes() since filter provider names aren't standard
export const filterCheckboxFor = (name: string) => filterCheckboxes.filter((filterItem) => filterItem.$('label').getText()
  .then(text => text.toLowerCase().includes(name.toLowerCase()))).first();
export const clickFilterCheckbox = (name: string) => filterCheckboxFor(name).$('input').click();
export const activeFilterCheckboxes = filterCheckboxes.filter((filterItem) => filterItem.$('input').isSelected()
  .then(bool => bool));
export const filterTextbox = $$('.filter-panel-pf-category').first().$('input')
export const filterByName = (filter: string) => filterTextbox.sendKeys(filter);
export const clearFiltersText = $('.co-catalog-page__no-filter-results').$('.blank-slate-pf-helpLink').$('button');

// Modal views
export const operatorModal = $('.modal-content');
export const operatorModalIsLoaded = () => browser.wait(until.presenceOf(operatorModal), 1000)
  .then(() => browser.sleep(500));
export const operatorModalTitle = operatorModal.$('.catalog-item-header-pf-title');
export const closeOperatorModal = () => operatorModal.$('.close').click();
export const operatorModalIsClosed = () => browser.wait(until.not(until.presenceOf(operatorModal)), 1000)
  .then(() => browser.sleep(500));

export const isLoaded = () => browser.wait(until.presenceOf($('.loading-box__loaded')), 10000).then(() => browser.sleep(500));
