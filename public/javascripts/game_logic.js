
if (document.readyState !== "loading") {
	// Document ready, executing
	console.log("Document ready, executing");
	initializeCode();
}else {
	document.addEventListener("DOMContentLoaded", function() {
	// Document was not ready, executing when loaded
	console.log("Document ready, executing after a wait");
	initializeCode();
	});
}



function initializeCode() {
	console.log("Initializing");
	// Adding all cells of the table to an array
	const cells = document.getElementsByTagName("td");
	let i;
	for (i = 0; i < cells.length; i++) {
		let cell_id = cells[i].id;
		cells[i].addEventListener("mousedown", event => {
			cell_click(cell_id);
			event.stopPropagation();
		});
	}
}


function cell_click(cell_id) {

let cell_content = document.getElementById(cell_id).textContent;

if (cell_content == ""){
	let temp = cell_id.split("_");
	let form_id = temp[0] + "-" + temp[1];
	document.forms[form_id].submit();
}

}
