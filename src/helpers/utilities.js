import * as XLSX from "xlsx";
import { message, notification } from "antd";
import { getYear, differenceInDays } from "date-fns";
import { urls } from "./config";
import { postData } from "./api";
import _ from "lodash";
const CryptoJS = require( "crypto-js" );


export const cedisLocale = Intl.NumberFormat( "en-GH" );
export const appUrl = urls.devApi;

export const toTitleCase = ( word ) => {
	let firstChar = word.slice( 0, 1 ),
		remainder = word.slice( 1 );
	return `${ firstChar.toUpperCase() }${ remainder.toLowerCase() }`;
};

export const generateFileUrl = ( fileName, isImage = true ) => {
	if ( !fileName ) return null;

	let url = "";
	if ( isImage ) {
		url = appUrl.slice( 0, -3 ) + "uploads/images";
	} else {
		url = appUrl.slice( 0, -3 ) + "uploads/videos";
	}
	return `${ url }/${ fileName }`;
};

export const uploadFile = async ( url, file, fileName ) => {
	const formData = new FormData();
	formData.append( fileName, file );

	try {
		const res = await postData( url, formData );
		if ( res.status === 200 ) return res;
		throw new Error( "file upload failed" );
	} catch ( ex ) {
		console.log( "error " );
	}
};

export const priceChangePercentage = ( oldPrice, newPrice ) => {
	// new price - old price
	// divide answer by old price
	// multiply answer by 100
	if ( oldPrice === null || undefined ) return;
	if ( newPrice === null || undefined ) return;

	const change = oldPrice - newPrice;
	if ( change <= 0 ) return 0;

	const percentage = change / oldPrice;
	return ( percentage * 100 ).toFixed( 0 );
};

export function getRandomNumberBetween ( min, max ) {
	return Math.floor( Math.random() * ( max - min + 1 ) + min );
}

export function getBase64 ( img, callback ) {
	const reader = new FileReader();
	reader.addEventListener( "load", () => callback( reader.result ) );
	reader.readAsDataURL( img );
}

export function beforeUpload ( file ) {
	const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
	if ( !isJpgOrPng ) {
		message.error( "You can only upload JPG/PNG file!" );
	}
	const isLt2M = file.size / 1024 / 1024 < 2;
	if ( !isLt2M ) {
		message.error( "Image must smaller than 2MB!" );
	}
	return isJpgOrPng && isLt2M;
}

export const openNotification = (
	title,
	msg,
	type = "info",
	className = "",
	btn,
	duration = 10
) => {
	// type: info, success, warning, error
	const key = `open${ Date.now() }`;
	notification[ type ]( {
		message: title,
		description: msg,
		btn,
		key,
		placement: "top",
		className: "mt-5 " + className,
		duration,
	} );
};

export const encryptString = ( string, key ) => {
	// Encrypt
	const encrypted = CryptoJS.AES.encrypt( string, key ).toString();
	return encrypted;
};

export const decryptString = ( string, key ) => {
	// Decrypt
	const decrypted = CryptoJS.AES.decrypt( string, key );
	return decrypted.toString( CryptoJS.enc.Utf8 );
};

export const toUrl = ( text ) => {
	if ( text === undefined || text.length === 0 || text === "" ) return;
	return text.trim().toLowerCase().replace( " ", "-" );
};

export const calcAge = ( birthdate ) => {
	const thisYear = getYear( new Date() );
	const yearFromDate = getYear( new Date( birthdate ) );
	return thisYear - yearFromDate;
};

export const populateLowStock = ( prods ) => {
	try {
		const lowStocks = [];
		const remainder = [];

		prods.filter( ( p ) => {
			if ( p.quantity <= p.minQty ) {
				lowStocks.push( p );
				return false;
			}

			remainder.push( p );
		} );

		return { lowStocks, remainder };
	} catch ( ex ) {
		openNotification( "populate low stock Error", ex, "error" );
		console.log( "error ", ex );
	}
};

export const getExpiredProds = ( prods ) => {
	// console.log(differenceInMonths(new Date(), new Date(prods[0].expiryDate)));
	try {
		const expired = prods.filter( ( p ) => {
			if ( !_.isEmpty( p.expiryDate ) ) {
				if ( daysToExpiry( p.expiryDate ) <= 90 ) {
					return true;
				}
			}
		} );

		return expired;
	} catch ( ex ) {
		openNotification( "get expired products error", ex, "error" );
		console.log( "error ", ex );
	}
};

export const daysToExpiry = ( expiryDate ) => {
	try {
		if ( _.isEmpty( expiryDate ) ) {
			return;
		}
		return differenceInDays( new Date( expiryDate ), new Date() );
	} catch ( ex ) {
		openNotification( "days to expir", ex, "error" );
		console.log( "error ", ex );
	}
};

export const extractInputData = ( e ) => {
	try {
		e.preventDefault();
		const data = {};
		Object.values( e.target ).map( ( ip ) => {
			// look for input nodes with name properties
			if ( ip.nodeName === "INPUT" && ip.name ) data[ ip.name ] = ip.value;
		} );
		return data;
	} catch ( ex ) {
		openNotification( "Extract Error", ex, "error" );
		console.log( "error", ex );
	}
};

export function toggleFullScreen () {
	// if (!document.fullscreenElement) {
	// 	document.documentElement.requestFullscreen();
	// } else {
	// 	if (document.exitFullscreen) {
	// 		document.exitFullscreen();
	// 	}
	// }
}

export const exportToExcel = (
	tableId,
	fileName = "spearPOS WORKBOOK",
	sheetName = "sheet1"
) => {
	try {
		var elt = document.getElementById( tableId );
		var wb = XLSX.utils.table_to_book( elt, { sheet: sheetName } );
		return XLSX.writeFile( wb, `${ fileName }.xlsx` );
	} catch ( ex ) {
		openNotification(
			"Export Error",
			"there was an error exporting to excel",
			"error"
		);
		console.log( ex );
	}
};

export const isElectron = () => {
	const userAgent = navigator.userAgent.toLowerCase();
	return userAgent.indexOf( "electron/" ) !== -1;
};

export const toggleRegisterState = ( registerData = "" ) => {
	// do the opposite the of whatever the state is
	// isRegisterOpen()
	// 	? sessionStorage.removeItem( "register" )
	// 	: sessionStorage.setItem( "register", JSON.stringify( registerData ) );
	isRegisterOpen()
		? deleteRegister()
		: window.posRegister = registerData;
};

export const isRegisterOpen = () => {
	// return sessionStorage.getItem( "register" ) ? true : false;
	return window.posRegister ? true : false;
};

export const getRegister = () => {
	// return JSON.parse( sessionStorage.getItem( "register" ) );
	return window.posRegister;
};

export const resetRegister = ( deletedId ) => {
	if ( deletedId === getRegister()?.id ) {
		// reset register state when the deleted is an open register
		// console.log(
		// 	"deleted record id: ",
		// 	deletedId,
		// 	"  ---  instore register: ",
		// 	getRegister()
		// );
		// sessionStorage.removeItem( "register" );
		delete window.posRegister;
	}
};

export const deleteRegister = () => {
	delete window.posRegister;
}



// export const barCodeReader = () => {
// 	if ( ( "BarcodeDetector" in window ) ) {
// 		console.log( "Barcode Detector supported!" );

// 		// create new detector
// 		const barcodeDetector = new BarCodeDetector( {
// 			formats: [ "code_39", "codabar", "ean_13", "ean_8" ],
// 		} );

// 		barcodeDetector
// 			.detect( imageEl )
// 			.then( ( barcodes ) => {
// 				barcodes.forEach( ( barcode ) => console.log( barcode.rawValue ) );
// 			} )
// 			.catch( ( err ) => {
// 				console.log( err );
// 			} );
// 	}
// }
