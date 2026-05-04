const MultiCalendarLocators = {

  
  searchInput: 
    'input[placeholder="Search listings, IDs, cities, and tags"]',
  filtersButton: 
    'button#filter-listings-button',
  quickFiltersButton: 
    'button[qa-id="qf-quick-filters-menu-button"]',

 
  listingRow: 'tr[data-index]',
  listingRowByName: (name) => 
    `tr[data-index]:contains("${name}")`,
  listingRowByIndex: (index) => 
    `tr[data-index="${index}"]`,

 
  listingCheckbox: '[qa-id^="bulk-"]',
  listingCheckboxByListingId: (listingId) => 
    `[qa-id="bulk-${listingId}"]`,

  
  threeDotsMenu: '[qa-id^="listing-ellipses-"]',
  threeDotsMenuByListingId: (listingId) => 
    `[qa-id="listing-ellipses-${listingId}"]`,

 
  addOverridesOption: 
    'button:contains("Add Overrides")',
  viewOverridesOption: 
    'button:contains("View Overrides")',
  syncNowMenuItem: 
    'button:contains("Sync Now")',
  saveRefreshOption: 
    '[qa-id^="save-"]',
  saveRefreshByListingId: (listingId) => 
    `button[qa-id="save-${listingId}"]`,


  applyOverrideBtn: 
    'button:contains("Apply Override")',
  saveRefreshBtn: 
    'button:contains("Save & Refresh")',
  syncNowBtn: 
    'button:contains("Sync Now")',
  clearSelectionBtn: 
    'button:contains("Clear Selection")',

  
  dsoPanelTitle: 
    'p:contains("Date Specific Overrides")',

 
  datePickerDefaultRange: 
    '[qa-id="date-picker-default-range"]',
  startDateContainer: 
    '[qa-id="date-picker-calendar-start"]',
  endDateContainer: 
    '[qa-id="date-picker-calendar-end"]',
  startDateText: 
    '[qa-id="date-picker-calendar-start"] p',
  endDateText: 
    '[qa-id="date-picker-calendar-end"] p',
  datePickerPopper: 
    '.react-datepicker-popper',
  datePickerCalendar: 
    '.react-datepicker',

  
  calendarDay: (day) => {
  const padded = String(day).padStart(3, '0')
  return `.react-datepicker__day--${padded}` +
         `:not(.react-datepicker__day--outside-month)`
},
  calendarNextMonth: 
    '.react-datepicker__navigation--next',
  calendarPrevMonth: 
    '.react-datepicker__navigation--previous',


 percentRadio: 'input[type="radio"][value="percent"]',
fixedRadioInput: 'input[type="radio"][value="fixed"]',
  newFinalPriceInput: 
    'input[qa-id="dso-price"]',

  // + Add buttons
  minPriceAddBtn: 
    'button[title="Add"]:eq(1)',
  maxPriceAddBtn: 
    'button[title="Add"]:eq(2)',
  basePriceAddBtn: 
    'button[title="Add"]:eq(3)',

  minPriceInput: 
    'input[qa-id="dso-min-price"]',
  maxPriceInput: 
    'input[qa-id="dso-max-price"]',
  basePriceInput: 
    'input[qa-id="dso-base-price"]',

  
  checkInOutToggle: 
    'span[class="chakra-switch__track css-1y0a7zy"]',
  checkInSelectAll: 
    'button[qa-id="check-in-select-all-button"]',
  enforceWeeklyDropdown: 
    '[id^="react-select"][id$="input"]',
  enforceWeeklyOption: (option) => 
    `[class*="option"]:contains("${option}")`,


  dsoCancelButton: 
    'button#dso-modal-cancel-btn-v2',
  dsoAddButton: 
    'button#add-dso-button-v2',

  
  toastMessage: 
    '.Toastify__toast, [class*="toast"]',

};

module.exports = MultiCalendarLocators;