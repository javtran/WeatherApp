import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import "dotenv/config";

const app = express();
const port = 3000;
const API_KEY = process.env.API_KEY;

var data = null;
var err = null;

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
	res.render("index.ejs", { data: data, error: err });
	data = null;
	err = null;
});

app.post("/", async (req, res) => {
	const { search } = req.body;
	try {
		let result = await axios.get(
			`http://api.openweathermap.org/geo/1.0/direct`,
			{
				params: {
					q: search,
					appid: API_KEY,
				},
			}
		);
		const { lat, lon, country, state, name } = result.data[0];
		result = await axios.get(
			"https://api.openweathermap.org/data/2.5/weather",
			{
				params: {
					lat: lat,
					lon: lon,
					units: "Imperial",
					appid: API_KEY,
				},
			}
		);
		const { wind, weather, main } = result.data;
		data = {
			name: name,
			country: country,
			state: state,
			wind: wind.speed,
			humidity: main.humidity,
			weather: weather[0],
			temp: main.temp,
		};
	} catch (error) {
		err = search;
	}
	res.redirect("/");
});

app.listen(port, () => {
	console.log(`Server Listening on port http://localhost:${port}`);
});
