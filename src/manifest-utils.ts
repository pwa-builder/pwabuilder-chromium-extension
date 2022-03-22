export async function fetchManifest(manifestUri: string) {
  const response = await fetch(manifestUri);
  const json = await response.json();
  return json;
}
