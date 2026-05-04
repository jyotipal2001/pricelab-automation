const DashboardLocators = {

  // ─── Navigation ────────────────────────────────────
  dynamicPricingDropdown: 
    'button[qa-id="dp-dropdown-button"]',
  manageListingNav: 
    'p[qa-id="ml-description"]',
  multiCalendarNav: 
    'p[qa-id="mc-title"]',
  pricingDashboardNav: 
    'p[qa-id="pd-title"]',

  
  listingSearchInput: 
    'input[placeholder="Search listings, IDs, cities, and tags"]',

 
  addColumnBtn: 
    'button:contains("Add Column")',
  addMetricsBtn: 
    'button[title="Add Metrics"]',
  filtersBtn: 
    'button:contains("Filters")',
  rowColumnBtn: 
    'button[qa-id="pd-row-coloumn-visibility"]',

  overridesRowCheckbox: 
    'label[qa-id="mc-row-col-visibility-dso-override"]',
  minStayRowCheckbox: 
    'label[qa-id="mc-row-col-visibility-min-stay"]',
  bedroomCountCheckbox: 
    'label[qa-id="mc-brCount-checkbox"]',

 
  quickFiltersBtn: 
    'button[qa-id="qf-quick-filters-menu-button"]',
  filterPMS: 
    'div[qa-id="qf-pms-filters"]',
  filterSyncOn: 
    'div[qa-id="qf-listing-sync-on-button"]',

  
  filterModalOpenBtn: 
    'button#filter-listings-button',
  filterByListings: 
    'button[qa-id="filter-dropdown-opt-listings"]',
  filterByPMS: 
    'button[qa-id="filter-dropdown-opt-pms"]',
  filterByTags: 
    'button[qa-id="filter-dropdown-opt-tags"]',
  clearFilterBtn: 
    'button:contains("Clear Filter")',
  saveAsQuickFilterBtn: 
    'button:contains("Save as Quick Filter")',
  cancelFilterBtn: 
    'button[qa-id="mc-cancel-filters-modal"]',
  applyFilterBtn: 
    'button[qa-id="mc-listing-filter-show-listings"]',

  
  adrPast45Days: 
    'p[qa-id="select-metric-text-ADR Past 45 Days"]',
  clearMetricsBtn: 
    'button[qa-id="add-metrics-clear-btn"]',
  updateMetricsBtn: 
    'button[qa-id="add-metrics-update-changes-btn"]',

  syncPriceToggleByListingId: (listingId) => 
    `div[qa-id="mc-sync-toggle-${listingId}"]`,


  saveRefreshByListingId: (listingId, pms) => 
    `button[qa-id="save-${listingId}___${pms}"]`,

  listingRow: 'tr[data-index]',
  listingRowByName: (name) => 
    `tr[data-index]:contains("${name}")`,

 
  bulkSaveRefreshBtn: 
    'button[qa-id="save-and-refresh-mc-bulk-btn"]',
  bulkSyncNowBtn: 
    'button[qa-id="sync-now-mc-bulk"]',
  bulkApplyOverrideBtn: 
    'button[qa-id="apply-override-mc-bulk"]',
  bulkClearSelectionBtn: 
    'button[qa-id="clear-bulk-selection-mc"]',

};

module.exports = DashboardLocators;