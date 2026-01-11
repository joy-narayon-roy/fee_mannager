export default function (port?: string | number | undefined): string {
  const location = window.location;
  return `${location.protocol}//${location.hostname}:${port || location.port}`;
}
