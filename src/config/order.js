// Minimum cart value (in rupees) needed to place an order.
// Change it here and the home banner, cart drawer and checkout rules all follow.
// Backend twin: app.order.min-amount in application.properties (or MIN_ORDER_AMOUNT env var on Railway).
export const MIN_ORDER_AMOUNT = 3500

export const formatINR = (n) => Number(n || 0).toLocaleString('en-IN')