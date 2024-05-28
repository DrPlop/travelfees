const numberFormat = new Intl.NumberFormat(navigator.locale, {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 2,
});

function currencyToNumber(currency) {
  const digits = currency.replace("€", "");
  return Number(digits);
}

function fetchElements() {
  const isTrainFlow = document.querySelector(
    '[data-testid="train-search-flow"]'
  );
  if (isTrainFlow) {
    return Array.from(document.querySelectorAll('[data-testid*="price"]'));
  }
  return Array.from(document.querySelectorAll('[data-testid*="currency"]'));
}

function setPriceWithFees() {
  const elements = fetchElements();
  elements.forEach((el) => {
    const value = el.innerText;
    const amount = currencyToNumber(value) * 1.03;
    if (isNaN(amount)) {
      return;
    }

    const formattedAmount = numberFormat.format(amount);

    el.innerText = formattedAmount;
    el.style.color = "#5d21d2";
    el.removeAttribute("data-testid");
  });
}

function onMutation(records) {
  for (const record of records) {
    if (record.type === "childList") {
      const currencyMatch = Array.from(record.addedNodes).some((node) =>
        /€/.test(node.innerText)
      );
      if (currencyMatch) {
        setPriceWithFees();
      }
    }
  }
}

async function watchForChanges() {
  console.log("Travelfees loaded");
  const observer = new MutationObserver(onMutation);
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

watchForChanges();
