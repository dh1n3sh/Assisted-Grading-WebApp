import axios from 'axios'
axios.defaults.xsrfHeaderName = "X-CSRFToken"
axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.withCredentials = true
// axios.defaults.headers.get['Access-Control-Allow-Origin'] ='true';
// axios.defaults.baseURL = "https://assisted-grading.herokuapp.com/"

export default axios