export function sizedImage(url, px) {
  return url ? url.replace(/\._AC_[A-Z]{2}\d+_\./, `._AC_SL${px}_.`) : url;
}
