import * as React from 'react';
import * as _ from 'lodash-es';
import * as PropTypes from 'prop-types';
import {CatalogTileView} from 'patternfly-react-extensions/dist/esm/components/CatalogTileView';
import {CatalogTile} from 'patternfly-react-extensions/dist/esm/components/CatalogTile';
import {FilterSidePanel} from 'patternfly-react-extensions/dist/esm/components/FilterSidePanel';
import {EmptyState} from 'patternfly-react/dist/esm/components/EmptyState';
import FormControl from 'patternfly-react/dist/esm/components/Form/FormControl';

import {normalizeIconClass} from '../catalog-item-icon';

function getFilterItems(items, field) {
  const filterItems = {};
  _.each(items, item => {
    const itemValue = item[field];
    if (itemValue) {
      filterItems[itemValue] = {
        label: itemValue,
        value: itemValue,
        active: false,
      };
    }
  });
  return filterItems;
}

function getFilters(items, filterCategories=[]) {
  const filters = {
    name: {
      value: '',
      active: 'false',
    },
  };

  if (filterCategories.length > 0) {
    _.each(filterCategories, field => {
      const filterItems = getFilterItems(items, field);
      if (filterItems) {
        filters[field] = filterItems;
      }
    });
  } else if (items.length > 0){
    // Sample filter fields from first item
    _.forOwn(items[0], (value, field) => {
      if (field === 'obj' || field.includes('iconClass') || field.includes('imgUrl')) {
        return;
      }
      const filterItems = getFilterItems(items, field);
      if (filterItems) {
        filters[field] = filterItems;
      }
    });
  }

  return filters;
}

function assignFilterState(newFilters, oldFilters) {
  const filters = _.cloneDeep(newFilters);
  // Takes values in oldFilters and applies them to newFilters
  // Sets newFilters active if oldFilters are active
  _.forOwn(filters, (categoryValue, category) => {
    if (category === 'name') {
      filters[category] = oldFilters[category];
    } else {
      _.forOwn(filters[category], (filterValue, filter) => {
        if (oldFilters[category].hasOwnProperty(filter)) {
          filters[category][filter] = oldFilters[category][filter];
        }
      });
    }
  });

  return filters;
}

const filterCategories = [
  'provider',
];

export class MarketplaceTileViewPage extends React.Component {
  constructor(props) {
    super(props);

    const {items} = this.props;

    const filters = getFilters(items, filterCategories);

    const filterCounts = this.getFilterCounts(filters);

    this.state = {
      filteredItems: items,
      filters,
      filterCounts,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    const {filters} = this.state;
    const {items} = this.props;
    if ((items === prevProps.items) && (filters === prevState.filters)) {
      return;
    }

    const updatedState = {};
    let currentFilters = filters;

    // Update filters to match new items
    if (items !== prevProps.items) {
      const newFilters = getFilters(items, filterCategories);
      // Apply current filter state to new filters
      updatedState.filters = assignFilterState(newFilters, currentFilters);
      currentFilters = updatedState.filters;
    }

    // If only filters have changed, update filter items and filter counts
    if (currentFilters !== prevState.filters) {
      const { filteredItems, filterCounts } = this.getFilterItemsAndCounts(currentFilters);
      updatedState.filteredItems = filteredItems;
      updatedState.filterCounts = filterCounts;
    }

    this.setState(updatedState);
  }

  getFilterItemsAndCounts(filters) {
    const {items} = this.props;
    const itemsAndCounts = {
      filteredItems: {},
      filterCounts: {},
    };

    const filteredByCategory = this.filterByCategory(filters);

    // The intersection of each filter gives the result
    const filteredItems = _.intersection(..._.map(filteredByCategory, categoryItems => categoryItems));

    itemsAndCounts.filteredItems = this.filterByName(_.sortBy(filteredItems, (item) => item.name), filters);

    // Get counts for each category
    const newFilterCounts = {};
    _.forOwn(filters, (category, key) => {
      if (key === 'name') {
        return;
      }
      const filtered = this.filterByName(_.intersection(..._.map(filteredByCategory, (categoryItems, categoryKey) => categoryKey === key ? items : categoryItems)), filters);
      newFilterCounts[key] = this.getFilterCountsByCategory(category, key, filtered);
    });

    itemsAndCounts.filterCounts = newFilterCounts;

    return itemsAndCounts;
  }

  filterByCategory(filters) {
    const {items} = this.props;

    const filteredByCategory = {};
    // Filters as follows:
    //   Active filters in the same category result in the union of items shown
    //   Active filters in separate categories result in the intersection
    _.forOwn(filters, (category, key) => {
      if (key === 'name') {
        return;
      }

      let categoryItems = [];
      let categoryActive = false;
      _.forOwn(category, elem => {
        if (elem.active) {
          categoryActive = true;
          categoryItems = _.union(categoryItems, _.filter(items, (item) => item[key] === elem.value));
        }
      });
      // Filter items only if the category is active
      if (categoryActive) {
        filteredByCategory[key] = categoryItems;
      } else {
        filteredByCategory[key] = items;
      }
    });

    // Returns items filtered by each category
    return filteredByCategory;
  }

  getFilterCountsByCategory(filter, category, items) {
    // Return counts for this category
    const categoryCounts = {};

    if (category === 'name') {
      // Should never be called with this key
      return {};
    }

    const count = _.countBy(items, category);

    _.forOwn(filter, (value, elem) => {
      categoryCounts[elem] = count[elem] || 0;
    });

    return categoryCounts;
  }

  filterByName(items, filters) {
    const {name} = filters;
    if (name.active) {
      const filterString = name.value.toLowerCase();
      return _.filter(items, item => item.name.toLowerCase().includes(filterString));
    }
    return items;
  }

  // getFilterCounts and filterItems are kept for convenience
  // For any case where both filterCounts and filteredItems are updated together
  // use getFilterItemsAndCounts
  getFilterCounts(filters) {
    return this.getFilterItemsAndCounts(filters).filterCounts;
  }

  filterItems(filters) {
    return this.getFilterItemsAndCounts(filters).filteredItems;
  }

  clearFilters() {
    const filters = _.cloneDeep(this.state.filters);
    _.forOwn(filters, (category, key) => {
      if (key === 'name') {
        filters.name.active = false;
        filters.name.value = '';
      } else {
        _.forOwn(category, (cItem, elem) => {
          filters[key][elem].active = false;
        });
      }
    });
    this.setState({filters});
  }

  onFilterChange(filterType, id, value) {
    const filters = _.cloneDeep(this.state.filters);
    if (filterType === 'name') {
      const active = !!value;
      filters[filterType] = { active, value };
    } else {
      filters[filterType][id].active = value;
    }
    this.setState({filters});
  }

  renderTiles() {
    const items = this.state.filteredItems;
    const {openOverlay} = this.props;

    return (
      <CatalogTileView.Category totalItems={items.length} viewAll={true}>
        {_.map(items, ((item, index) => {
          const { name, imgUrl, iconClass, provider, description } = item;
          const uid = `${name}-${index}`;
          const normalizedIconClass = iconClass ? `icon ${normalizeIconClass(iconClass)}` : null;
          const vendor = provider ? `Provided by ${provider}` : null;
          return <CatalogTile
            id={uid}
            key={uid}
            title={name}
            iconImg={imgUrl}
            iconClass={normalizedIconClass}
            vendor={vendor}
            description={description}
            onClick={() => openOverlay(item)}
          />;
        }))}
      </CatalogTileView.Category>
    );
  }

  render() {
    const { filters, filterCounts } = this.state;
    const items = this.state.filteredItems;

    return (
      <div className="co-catalog-page">
        <div className="co-catalog-page__tabs">
          <FilterSidePanel>
            {_.map(filters, ((filter, category) => {
              if (category === 'name') {
                return (<FilterSidePanel.Category key={category}>
                  <FormControl type="text" placeholder="Filter by name..." bsClass="form-control"
                    value={filters.name.value}
                    onChange={e => this.onFilterChange('name', null, e.target.value)}
                  />
                </FilterSidePanel.Category>);
              }
              return (<FilterSidePanel.Category
                key={category}
                title={category}
              >
                {_.map(filter, ((filterItem, categoryItem) => {
                  const label = filterItem.label;
                  return (<FilterSidePanel.CategoryItem
                    key={categoryItem}
                    count={filterCounts[category][categoryItem]}
                    checked={filterItem.active}
                    onChange={e => this.onFilterChange(category, categoryItem, e.target.checked)}
                  >
                    {label}
                  </FilterSidePanel.CategoryItem>);
                }))}
              </FilterSidePanel.Category>);
            }))}
          </FilterSidePanel>
        </div>
        <div className="co-catalog-page__content">
          <div>
            <div className="co-catalog-page__num-items">{_.size(items)} items</div>
          </div>
          {items.length > 0 && <CatalogTileView>
            {this.renderTiles()}
          </CatalogTileView>}
          {items.length === 0 && <EmptyState className="co-catalog-page__no-filter-results">
            <EmptyState.Title className="co-catalog-page__no-filter-results-title" aria-level="2">
              No Results Match the Filter Criteria
            </EmptyState.Title>
            <EmptyState.Info className="text-secondary">
               No marketplace items are being shown due to the filters being applied.
            </EmptyState.Info>
            <EmptyState.Help>
              <button type="text" className="btn btn-link" onClick={() => this.clearFilters()}>Clear All Filters</button>
            </EmptyState.Help>
          </EmptyState>}
        </div>
      </div>
    );
  }
}

MarketplaceTileViewPage.displayName = 'MarketplaceTileViewPage';
MarketplaceTileViewPage.propTypes = {
  items: PropTypes.array,
};
