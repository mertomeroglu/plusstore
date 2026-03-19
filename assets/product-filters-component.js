class ProductFiltersComponent extends HTMLElement {
  constructor() {
    super();
    this.handle = this.dataset.filterHandle;
    this.accordion = this.closest('accordion-component');
    this.classList.add('is-loading');
    const url = `${this.handle}?view=filter`;
    fetch(url)
      .then(response => response.text())
      .then((responseText) => {
        const html = new DOMParser().parseFromString(responseText, 'text/html');
        this.innerHTML = html.getElementById('product-filters-form').innerHTML;
        this.classList.remove('is-loading');
        this.submitForm();
//         this.accordion.init();
        this.querySelectorAll('input[type="range"]')
        .forEach(element => {
          element.addEventListener('change', this.onRangeChange.bind(this));
          element.addEventListener('input', this.onRangeChange.bind(this));
        });
        this.querySelectorAll('input[type="number"]')
        .forEach(element => {
          element.addEventListener('change', this.onInputChange.bind(this));
          element.addEventListener('input', this.onInputChange.bind(this));
        });
        this.updateRangeTrack();
      });
  }
  
  submitForm() {
    this.debouncedOnSubmit = debounce((event) => {
      this.onSubmitHandler(event);
    }, 500);

    this.querySelector('form').addEventListener('input', this.debouncedOnSubmit.bind(this));
  }
  
  onSubmitHandler(event) {
    event.preventDefault();
    const formData = new FormData(event.target.closest('form'));
    const searchParams = new URLSearchParams(formData).toString();
    const url = `${this.handle}?${searchParams}`;
    window.location.href = url;
  }
  
  onRangeChange(event) {
    this.setMinAndMaxRangeValues();
    this.updateRangeTrack();
  }

  onInputChange(event) {
    this.setMinAndMaxInputValues();
    this.updateRangeTrack();
  }
  
  setMinAndMaxRangeValues() {
    const inputs = this.querySelectorAll('input[type="number"]');
    const minInput = inputs[0];
    const maxInput = inputs[1];
	const ranges = this.querySelectorAll('input[type="range"]');
	let minRange = ranges[0];
    let maxRange = ranges[1];
	if (parseInt(maxRange.value) < parseInt(minRange.value)) {
      minRange = ranges[1];
      maxRange = ranges[0];
    }
	if (maxRange.value) {
	  maxInput.value = maxRange.value;
	}
    if (minRange.value) {
	  minInput.value = minRange.value;
    }
  }

    setMinAndMaxInputValues() {
      const inputs = this.querySelectorAll('input[type="number"]');
      const minInput = inputs[0];
      const maxInput = inputs[1];
  	const ranges = this.querySelectorAll('input[type="range"]');
  	let minRange = ranges[0];
      let maxRange = ranges[1];
  	if (parseInt(maxRange.value) < parseInt(minRange.value)) {
        minRange = ranges[1];
        maxRange = ranges[0];
      }
  	if (maxInput.value) {
  	  maxRange.value = maxInput.value;
  	}
      if (minInput.value) {
  	  minRange.value = minInput.value;
      }
    }

    updateRangeTrack() {
      const rangeWrapper = this.querySelector('.facets__price-range');
      if (!rangeWrapper) return;
      const ranges = rangeWrapper.querySelectorAll('input[type="range"]');
      if (ranges.length < 2) return;

      const first = Number(ranges[0].value || 0);
      const second = Number(ranges[1].value || 0);
      const minValue = Math.min(first, second);
      const maxValue = Math.max(first, second);
      const maxRange = Number(ranges[0].max || 100);
      const safeMax = maxRange > 0 ? maxRange : 100;

      const minPercent = (minValue / safeMax) * 100;
      const maxPercent = (maxValue / safeMax) * 100;

      rangeWrapper.style.setProperty('--range-min', `${minPercent}%`);
      rangeWrapper.style.setProperty('--range-max', `${maxPercent}%`);
    }
}

customElements.define('product-filters-component', ProductFiltersComponent);