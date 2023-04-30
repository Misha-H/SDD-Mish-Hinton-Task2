(async () => {
  const responce = await (
    await fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=-33.87&longitude=151.21&hourly=temperature_2m&forecast_days=16&timezone=auto&daily=temperature_2m_max&daily=temperature_2m_min&start_date=2023-03-26&end_date=2023-05-06'
    )
  ).json();
  console.log(responce);
})();
