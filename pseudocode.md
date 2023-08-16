# Pseudocode

```typescript
const getWeather = async (startDate: string, endDate: string) => {
  try {
    const response = await (
      await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=-33.87&longitude=151.21&hourly=temperature_2m&forecast_days=16&timezone=auto&daily=temperature_2m_max&daily=temperature_2m_min&start_date=${startDate}&end_date=${endDate}`
      )
    ).json();
    console.log(response);

    // checking if the api returns an error, specific to this api.
    if (response.error) {
      return;
    }

    const dailyTimes: Array<string> = response.daily.time;

    for (let i = 0; i < dailyTimes.length; i++) {
      weather.push({
        date: new Date(dailyTimes[i]).setHours(0, 0, 0, 0),
        max: Math.round(response.daily.temperature_2m_max[i]),
        min: Math.round(response.daily.temperature_2m_min[i]),
      });
    }
  } catch (error) {
    console.error(error);
  }
};
```

```pseudocode
function getWeather (startDate: string, endDate: string)

  try:
    response = fetchWeatherData(startDate, endDate)

    if response has 'error'
      return

    for i= 0 to length of dailyTimes
      date = create Date object with dailyTimes[i] and time to midnight
      maxTemperature = response.daily.temperature_2m_max[i] as an integer
      minTemperature = response.daily.temperature_2m_min[i] as an integer
      push { date, maxTemperature, minTemperature } to global weather array

  catch:
    print error
```
