import {setCookieWithExpireHour,getCookie} from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.4/cookie.js";
import {postJSON} from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.4/api.js";
import {redirect} from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.4/url.js";
import {addCSSInHead,addJSInHead} from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.6/element.js";
import Swal from 'https://cdn.jsdelivr.net/npm/sweetalert2@11/src/sweetalert2.js';
   
   
await addCSSInHead("https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.css");
   
const url="https://asia-southeast2-io-adb.cloudfunctions.net/gocroot/auth/google";
   
const client_id="657221014041-bhahp3aeh0p3tdibo0td4kkpevcmsb4g.apps.googleusercontent.com";
   
// Panggil fungsi untuk menambahkan elemen
appendGoogleSignin(client_id,url);
   
   
// Buat fungsi untuk memanggil gsi js dan menambahkan elemen div ke dalam DOM
async function appendGoogleSignin(client_id, target_url) {
    try {
        // Memuat script Google Sign-In
        await addJSInHead("https://accounts.google.com/gsi/client");
        // Menginisialisasi Google Sign-In dan menetapkan gSignIn sebagai callback
        google.accounts.id.initialize({
            client_id: client_id,
            callback:  (response) => gSignIn(response, target_url), // Menggunakan gSignIn sebagai callback untuk Google Sign-In
        });
        // Render tombol Google Sign-In dalam elemen dengan id "tombolgsigngoogle"
        google.accounts.id.renderButton(
         document.getElementById("logs"),
         {
             theme: "outline", // Bisa "filled_blue", "filled_black", "outline"
             size: "large", // Bisa "small", "medium", "large"
             text: "signin_with", // Bisa "signin_with" atau "continue_with"
             shape: "pill", // Bisa "rectangular", "pill", "circle", "square"
         }
        );
        // Memunculkan pop-up Google Sign-In
        google.accounts.id.prompt();
        console.log('Google Sign-In open successfully!');
    } catch (error) {
        console.error('Failed to load Google Sign-In script:', error);
    }
}
   
async function gSignIn(response, target_url) {
    try {
        const gtoken = { token: response.credential };
        await postJSON(target_url, "token", response.credential, gtoken, responsePostFunction);
    } catch (error) {
        console.error("Network or JSON parsing error:", error);
        Swal.fire({
            icon: "error",
            title: "Network Error",
            text: "An error occurred while trying to log in. Please try again.",
        });
    }
}
   
function responsePostFunction(response) {
    if (response.status === 200 && response.data) {
        console.log(response.data);
        setCookieWithExpireHour('token',response.data.token,18);
        redirect("/dashboard");
    } else {
        console.error("Login failed: ", response.data?.error || "Unknown error");
        Swal.fire({
            icon: "error",
            title: "Login Failed",
            text: response.data?.error || "Anda belum terdaftar dengan login google, silahkan tap atau scan qr dahulu untuk pendaftaran.",
        }).then(() => {
            redirect("/signin");
        });
    }

}
