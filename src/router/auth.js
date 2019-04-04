export default {
  loggedIn () {
    return StorageGetter('token') || null
  }
}
export function StorageGetter (key) {
  return localStorage.getItem(key)
}  