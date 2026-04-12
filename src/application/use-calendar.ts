import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

/**
 * Composable to manage the calendar state (current month, year) using URL query parameters.
 * @returns Reactive state for year, month, and navigation methods
 */
export function useCalendar() {
  const route = useRoute()
  const router = useRouter()

  const year = computed(() => {
    const y = Array.isArray(route.query.year) ? route.query.year[0] : route.query.year
    const val = parseInt(y || '')
    return isNaN(val) ? new Date().getFullYear() : val
  })

  const month = computed(() => {
    const m = Array.isArray(route.query.month) ? route.query.month[0] : route.query.month
    const val = parseInt(m || '')
    return isNaN(val) ? new Date().getMonth() : val
  })

  /** Navigates to the current month and year. */
  function goToToday() {
    const now = new Date()
    router.push({
      query: { year: now.getFullYear().toString(), month: now.getMonth().toString() },
    })
  }

  /** Navigates to the next month. Handles year rollover. */
  function nextMonth() {
    let newYear = year.value
    let newMonth = month.value + 1

    if (newMonth > 11) {
      newMonth = 0
      newYear++
    }

    router.push({ query: { year: newYear.toString(), month: newMonth.toString() } })
  }

  /** Navigates to the previous month. Handles year rollover. */
  function previousMonth() {
    let newYear = year.value
    let newMonth = month.value - 1

    if (newMonth < 0) {
      newMonth = 11
      newYear--
    }

    router.push({ query: { year: newYear.toString(), month: newMonth.toString() } })
  }

  return {
    year,
    month,
    nextMonth,
    previousMonth,
    goToToday,
  }
}
