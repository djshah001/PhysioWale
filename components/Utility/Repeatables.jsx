const Repeatables = () => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const GoogleApiKey = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;
  const GoogleApi = process.env.EXPO_PUBLIC_GOOGLE_API;
  const blurhash =
    "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";
  return { apiUrl, GoogleApiKey, GoogleApi, blurhash };
};

export default Repeatables;
