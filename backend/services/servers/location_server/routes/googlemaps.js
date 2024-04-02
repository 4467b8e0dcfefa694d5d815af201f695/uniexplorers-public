const axios = require('axios')
const mongo = require('mongodb')

const {
    MONGO_USERNAME,
    MONGO_PASSWORD,
    MONGO_DATABASE,
    MONGO_HOST,
    MONGO_PORT,
} = process.env

const uri = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/?authSource=admin`
const client = new mongo.MongoClient(uri)

/**
 * @swagger
 * tags:
 *   -  name: geocode
 *      description: Retrieve geocode related data
 *   -  name: nearby
 *      description: Retrieve data related to nearby locations
 */

/**
 * @swagger
 * /nearbysearch:
 *   get:
 *     summary: Perform a nearby search
 *     description: Perform a nearby search using Google Places API.
 *     parameters:
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: The keyword to search for.
 *       - in: query
 *         name: lat
 *         schema:
 *           type: number
 *         description: The latitude of the location to search around.
 *       - in: query
 *         name: lng
 *         schema:
 *           type: number
 *         description: The longitude of the location to search around.
 *       - in: query
 *         name: radius
 *         schema:
 *           type: number
 *         description: The radius of the search area, in meters.
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: The type of place to search for (e.g., restaurant, bar).
 *     responses:
 *       200:
 *         description: Successful response with nearby places data.
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /geocode/city/{city}:
 *   get:
 *     summary: Get geocode data for a city
 *     tags: 
 *          - geocode
 *     description: Get geocode data (e.g., latitude, longitude) for a specified city.
 *     parameters:
 *       - in: path
 *         name: city
 *         schema:
 *           type: string
 *         required: true
 *         description: The name of the city.
 *     responses:
 *       200:
 *         description: Successful response with city geocode data.
 *       404:
 *         description: City geocode data not found
 */

/**
 * @swagger
 * /geocode/university/{university}:
 *   get:
 *     summary: Get geocode data for a university
 *     tags: 
 *          - geocode
 *     description: Get geocode data (e.g., latitude, longitude) for a specified university.
 *     parameters:
 *       - in: path
 *         name: university
 *         schema:
 *           type: string
 *         required: true
 *         description: The name of the university.
 *     responses:
 *       200:
 *         description: Successful response with university geocode data.
 *       404:
 *         description: University geocode data not found
 */

/**
 * @swagger
 * /nearby/city/{city}:
 *   get:
 *     summary: Get nearby data for a city
 *     tags: 
 *          - nearby
 *     description: Get nearby data (e.g., attractions, landmarks) for a specified city.
 *     parameters:
 *       - in: path
 *         name: city
 *         schema:
 *           type: string
 *         required: true
 *         description: The name of the city.
 *     responses:
 *       200:
 *         description: Successful response with city nearby data.
 *       404:
 *         description: City nearby data not found
 */

/**
 * @swagger
 * /nearby/university/{university}:
 *   get:
 *     summary: Get nearby data for a university
 *     tags: 
 *          - nearby
 *     description: Get nearby data (e.g., attractions, landmarks) for a specified university.
 *     parameters:
 *       - in: path
 *         name: university
 *         schema:
 *           type: string
 *         required: true
 *         description: The name of the university.
 *     responses:
 *       200:
 *         description: Successful response with university nearby data.
 *       404:
 *         description: University nearby data not found
 */

/**
 * @swagger
 * /place_photos:
 *   get:
 *     summary: Get photos for a place
 *     description: Get photos for a specified place using its place ID.
 *     parameters:
 *       - in: query
 *         name: place_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the place.
 *     responses:
 *       200:
 *         description: Successful response with photo references.
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *             description: A photo reference for the place.
 *       500:
 *         description: Internal server error
 */




module.exports = app => {
    app.route('/nearbysearch')
        .get(async (req, res) => {
            // const keyword = req.query.keyword
            // const lat = req.query.lat
            // const lng = req.query.lng
            // const radius = req.query.radius
            // const type = req.query.type

            const {
                keyword,
                lat,
                lng,
                radius,
                type
            } = req.query
            const {
                GOOGLE_MAPS_API_KEY
            } = process.env

            let url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"

            axios.get(url, {
                    params: {
                        keyword: keyword,
                        location: `${lat},${lng}`,
                        radius: radius,
                        type: type,
                        key: GOOGLE_MAPS_API_KEY
                    }
                })
                .then((data) => {
                    // console.log(data)
                    res.json(data.data)
                })
                .catch((error) => {
                    res.status(500).send()
                })

        })

    app.route('/geocode/city/:city')
        .get(async (req, res) => {
            const {
                city
            } = req.params

            const database = client.db(MONGO_DATABASE)
            const cityGeocode = database.collection('CityGeocode')

            try {
                const data = await cityGeocode.findOne({ key: city })
                if (data) {
                    return res.json(data)
                }

            } catch (error) {
                res.status(404).json({
                    "success": false,
                    "message": "city geocode data not found"
                })
            }
        })

    app.route('/geocode/university/:university')
        .get(async (req, res) => {
            const {
                university
            } = req.params

            const database = client.db(MONGO_DATABASE)
            const uniGeocode = database.collection('UniGeocode')
            
            try {
                const data = await uniGeocode.findOne({ key: university })
                if (data) {
                    return res.json(data)
                }

            } catch (error) {
                res.status(404).json({
                    "success": false,
                    "message": "uni geocode data not found"
                })
            }
        })

    app.route('/nearby/city/:city')
        .get(async (req, res) => {
            const {
                city
            } = req.params

            const database = client.db(MONGO_DATABASE)
            const cityNearby = database.collection('CityNearby')

            try {
                const data = await cityNearby.findOne({ key: city })
                if (data) {
                    return res.json(data)
                }

            } catch (error) {
                res.status(404).json({
                    "success": false,
                    "message": "city nearby data not found"
                })
            }
        })

    app.route('/nearby/university/:university')
        .get(async (req, res) => {
            const {
                university
            } = req.params

            const database = client.db(MONGO_DATABASE)
            const uniNearby = database.collection('UniNearby')

            try {
                const data = await uniNearby.findOne({ key: university })
                if (data) {
                    return res.json(data)
                }

            } catch (error) {
                res.status(404).json({
                    "success": false,
                    "message": "uni nearby data not found"
                })
            }
        })

    app.route("/place_photos")
        .get(async (req, res) => {
            const {
                GOOGLE_MAPS_API_KEY
            } = process.env
            const {
                place_id
            } = req.query

            let url = "https://maps.googleapis.com/maps/api/place/details/json"

            let data = await axios.get(url, {
                params: {
                    key: GOOGLE_MAPS_API_KEY,
                    placeid: place_id
                }
            })

            let photos = data.data.result.photos
            // console.log(photos)

            for (let idx in photos) {
                let curr_photo = photos[idx]
                curr_photo["size"] = curr_photo.height * curr_photo.width
            }

            let sorted_photos = photos.sort(
                (a, b) => b.size - a.size
            )

            sorted_photos = sorted_photos.slice(0, 5)

            // let image_url = "https://maps.googleapis.com/maps/api/place/photo"
            let photo_references = sorted_photos.map(
                // obj => `${image_url}?photoreference=${obj.photo_reference}`
                obj => obj.photo_reference
            )

            // const images = await Promise.all(
            //   photo_references.map(photo_reference => {
            //     axios.get(image_url, {
            //       params: {
            //         key: GOOGLE_MAPS_API_KEY,
            //         photoreference: photo_reference
            //       }
            //     })
            //     .then(
            //       (resp) => {
            //         let data = resp.data
            //         console.log(data)
            //       }
            //     )
            //   })
            // )

            res.json(photo_references)
        })
}