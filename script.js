class FormBase {

    validation_errors = []

    constructor() {
        debugger

        if (this.constructor === FormBase) {
            throw new Error("Abstract classes can't be instantiated.");
        }
    }


    display_errors() {
        let i = 0;
        for (let error in this.validation_errors) {
            i += 1
            let element = document.getElementsByName(error);
            element = element[0]
            if (!Exists(element)) {
                console.log('element -> ' + element + 'does not exist')
                continue
            }

            element.classList.add("input-error");
            element.insertAdjacentHTML(
                'afterend',
                '<p id="error_message_' + i + '" class="center-small-margin error_message" style="width: 75%; border-radius: 4px; margin-top: 6px; padding-top: 6px;">'
                + this.validation_errors[error] + '</p>'
            );
        }
    }

}

function update_promotion_items() {

    let promotionList = document.getElementById("promotion_list")
    let index = promotionList.selectedIndex
    let promotionName = promotionList.options[index].getAttribute('name')
    let items = Promotion.get_food_items_for_promotion(promotionName)
    let itemBox = document.getElementById("promotion_items")
    itemBox.innerHTML = "";
    for (let item_index in items) {
        let item = items[item_index]
        let option_element = document.createElement("option")
        option_element.text = item
        itemBox.add(option_element)
    }
}

function update_promo() {
    let promo = document.getElementById("promotion_list")
    let promo_option_index = promo.options.selectedIndex;
    let option_element = promo.options[promo_option_index];
    let attribute = option_element.getAttributeNode('name');
    let promo_key = attribute.value;
    let promotion_item = Promotion.promotions[promo_key];
    let promo_instance = new Promotion(null, promotion_item)
    promo_instance.set_html_fields()
}

function delete_promo() {
    let promo = document.getElementById("promotion_list")
    let promo_option_index = promo.options.selectedIndex;
    let option_element = promo.options[promo_option_index];
    let attribute = option_element.getAttributeNode('name');
    let promo_key = attribute.value

    delete Promotion.promotions[promo_key]
    localStorage["promotions"] = JSON.stringify(Promotion.promotions)
    window.alert("Promotion has been deleted")
    window.location.reload()
}


function push_gallery(direction) {
    const images = {
        "eyebrows.jpeg": 0,
        "Hair.jpg": 1,
        "lips.jpeg": 2,
        "mens_hair.jpeg": 3,
        "nails.jpeg": 4,
        "womans_hair.jpeg": 5,
    }
    const image_keys = Object.keys(images)

    let imagePlaceHolder1 = document.getElementById("image_placeholder1")
    let imagePlaceHolder2 = document.getElementById("image_placeholder2")
    let imagePlaceHolder3 = document.getElementById("image_placeholder3")

    let pos1 = images[imagePlaceHolder1.src.split("/").slice(-1)[0]]
    let pos2 = images[imagePlaceHolder2.src.split("/").slice(-1)[0]]
    let pos3 = images[imagePlaceHolder3.src.split("/").slice(-1)[0]]

    if (direction === "back" && pos1 !== 0) {
        imagePlaceHolder1.src = "images/" + image_keys[pos1 - 1]
        imagePlaceHolder2.src = "images/" + image_keys[pos2 - 1]
        imagePlaceHolder3.src = "images/" + image_keys[pos3 - 1]
    } else if (direction === "forward" && pos3 !== 5) {
        imagePlaceHolder1.src = "images/" + image_keys[pos1 + 1]
        imagePlaceHolder2.src = "images/" + image_keys[pos2 + 1]
        imagePlaceHolder3.src = "images/" + image_keys[pos3 + 1]
    }
}

function validate_promotion(event) {
    let promotion = new Promotion(document.promotionForm, null);

    // Validate Promotion
    let success = promotion.validate()

    let save_result = false
    if (success === true) {
        // save data to cookies
        save_result = promotion.save()
    } else {
        // display error on the html page
        event.preventDefault()
        promotion.display_errors()
        return
    }
    return success && save_result
}

function validate_attendee(event) {

    let attendee = new Attendee(document.sign_up_form);
    let success = attendee.validate()
    let save_result = false
    if (success === true) {
        // save data to cookies
        save_result = attendee.save()
    } else {
        // display error on the html page
        event.preventDefault()
        attendee.display_errors()
        return
    }

    return success && save_result
}


class Attendee extends FormBase {
    constructor(form) {
        super()

        // get all the current available promotions
        if (Exists(form.promotion_list.value)) {
            let promotion_element = form.promotion_list.selectedOptions[0]
            this.promotion = promotion_element.attributes.name.value
        } else {
            this.promotion = ""
        }

        this.name = form.sign_up_firstname.value
        this.surname = form.sign_up_lastname.value
        this.email = form.promotion_email.value
        this.phone_number = form.promotion_telephone_number.value

        this.comment = form.promotion_comment.value.trim()
        this.foodItems = ""
        let list_length = form.promotion_items.length
        let list_items = form.promotion_items
        this.validation_errors = {}
        for (let i = 0; i < list_length; i++) {
            let item = list_items[i]
            if (item.selected) {
                this.foodItems += list_items[i].value + ";"
            }
        }
    }

    validate() {
        if (!Exists(this.name)) {
            this.validation_errors['sign_up_firstname'] = "Please enter a name"
        }

        if (!Exists(this.surname)) {
            this.validation_errors['sign_up_lastname'] = "Please enter a surname"
        }

        if (!Exists(this.phone_number)) {
            this.validation_errors['promotion_telephone_number'] = "Please enter a phone number"
        }

        if (!Exists(this.email)) {
            this.validation_errors['promotion_email'] = "Please enter a valid email"
        }

        if (!Exists(this.promotion)) {
            this.validation_errors['promotion_list'] = "Please select a promotion"
        }

        if (!Exists(this.comment)) {
            this.validation_errors['promotion_list'] = "Please select a promotion"
        }

        if (!Exists(this.foodItems)) {
            this.validation_errors['promotion_list'] = "Please select a promotion"
        }

        let errors = Object.keys(this.validation_errors).length;
        return errors <= 0;
    }

    save() {
        // save the data into cookies
        document.cookie = "name=sign_page_cookie;";
        document.cookie = "path=" + encodeURIComponent("sign_up_page.html") + ';';
        document.cookie = "sign_up_firstname=" + encodeURIComponent(this.name) + ';';
        document.cookie = "sign_up_lastname=" + encodeURIComponent(this.surname) + ';';
        document.cookie = "promotion_email=" + encodeURIComponent(this.email) + ';';
        document.cookie = "promotion_telephone_number=" + encodeURIComponent(this.phone_number) + ';';
        document.cookie = "promotion=" + encodeURIComponent(this.promotion) + ';';
        var date = new Date();
        date.setTime(date.getTime() + (365 * 24 * 60 * 60 * 1000));
        document.cookie = "expires=" + date.toGMTString() + ';';

        let attendee = [
            this.name,
            this.surname,
            this.phone_number,
            this.email,
            this.comment,
            this.foodItems,
        ]
        let attendees = Exists(localStorage["attendees__" + this.promotion]) ? JSON.parse(localStorage["attendees__" + this.promotion]) : []
        attendees.push(attendee)
        localStorage.setItem('attendees__' + this.promotion, JSON.stringify(attendees));
        return true
    }

}

class Calendar {
    constructor(cal_table) {
        // initialize the fields
        this.table = cal_table
        this.tableheaders = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"]
        this.months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        this.today = new Date();
        this.currentMonth = this.today.getMonth();
        this.currentYear = this.today.getFullYear();
        this.currentDay = this.today.getDate();
        this.firstDay = (new Date(this.currentYear, this.currentMonth)).getDay();


        // create caption
        let caption = this.table.createCaption()
        let captionText = document.createTextNode(this.months[this.currentMonth] + " " + this.currentYear)
        caption.appendChild(captionText)

        //generate promotions
        this.promotions = Promotion.get_all_promotions()
    }

    build_table() {
        this.generate_headers(this.tableheaders)
        // creating all cells
        let date = 1;
        for (let i = 0; i < 6; i++) {
            // creates a table row
            let row = document.createElement("tr");

            //creating individual cells, filing them up with data.
            for (let j = 0; j < 7; j++) {
                if (i === 0 && j < this.firstDay) {
                    // create initial week
                    let cell = document.createElement("td");
                    let cellText = document.createTextNode("");
                    cell.appendChild(cellText);
                    row.appendChild(cell);
                } else if (date > this.days_in_month(this.currentMonth, this.currentYear)) {
                    break;
                } else {
                    let cell = document.createElement("td");
                    let cellText = document.createTextNode(date);
                    // let date_link = null;

                    // add background to current date
                    if (date === this.currentDay && this.currentYear === this.today.getFullYear() && this.currentMonth === this.today.getMonth()) {
                        cell.classList.add("b-red");
                    }

                    // add a zero this get the last two characters
                    let promotion_date_string = this.currentYear + "-" + ('0' + (this.currentMonth + 1)).slice(-2) + '-' + ('0' + date).slice(-2)
                    var date_link = null;
                    for (let promotion_key in this.promotions) {
                        let key_array = promotion_key.split("__")
                        if (key_array[1] == promotion_date_string) {
                            date_link = document.createElement("a")
                            date_link.appendChild(cellText)
                            date_link.setAttribute('href', 'promotion_summary_page.html?promotionName=' + promotion_key)
                            date_link.setAttribute('title', key_array[0])
                            date_link.setAttribute('class', 'b-green')
                        }
                    }

                    Exists(date_link) ? cell.appendChild(date_link) : cell.appendChild(cellText)
                    row.appendChild(cell);
                    date++;
                }
            }
            this.table.appendChild(row); // appending each row into calendar body.
        }
    }

    days_in_month(month, year) {
        // get days in month by overflowing current date
        return 35 - new Date(year, month, 35).getDate();
    }

    generate_headers(data) {
        let thead = this.table.createTHead();
        let row = thead.insertRow();
        for (let key of data) {
            let th = document.createElement("th");
            let text = document.createTextNode(key);
            th.appendChild(text);
            row.appendChild(th);
        }
    }

}

const ITEMS = {
    'COOL_DRINK_PRICE': 10,
    'TEA': 10,
    'SANDWHICHES': 10,
}

class Promotion extends FormBase {
    constructor(form = null, instance = null) {
        super()

        // assigning different field values in class
        if (form !== null) {
            this.promotion_name = form.promotion_name.value;
            this.promotion_type = form.promotion_type.value;
            this.promotion_description = form.promotion_description.value;
            this.promotion_date = form.promotion_date.value;
            this.start_date = form.start_date.value;
            this.end_date = form.end_date.value;

            // Capturing promotion address
            this.promotion_city = form.promotion_city.value;
            this.promotion_postalcode = form.promotion_postalcode.value;
            this.promotion_address = form.promotion_address.value;

            // capturing host details
            this.host_name = form.host_name.value;
            this.host_surname = form.host_surname.value;
            this.host_phonenumber = form.host_phonenumber.value;
            this.host_email = form.host_email.value;

            // This is the refreshments
            this.cooldrink = form.cooldrink.checked;
            this.tea = form.tea.checked;
            this.sandwhich = form.sandwhiche.checked;
        } else {
            // same as above just with an instance
            this.promotion_name = instance.promotion_name;
            this.promotion_type = instance.promotion_type;
            this.promotion_description = instance.promotion_description;
            this.promotion_date = instance.promotion_date;
            this.start_date = instance.start_date;
            this.end_date = instance.end_date;
            this.promotion_city = instance.promotion_city;
            this.promotion_postalcode = instance.promotion_postalcode;
            this.promotion_address = instance.promotion_address;
            this.host_name = instance.host_name;
            this.host_surname = instance.host_surname;
            this.host_phonenumber = instance.host_phonenumber;
            this.host_email = instance.host_email;
            this.cooldrink = instance.cooldrink;
            this.tea = instance.tea;
            this.sandwhich = instance.sandwhich;
        }
    }

    validate() {
        if (!Exists(this.promotion_name)) {
            this.validation_errors['promotion_name'] = "Promotion name cannot be empty"
        }

        if (!Exists(this.promotion_type)) {
            this.validation_errors['promotion_type'] = "Promotion type cannot be empty"
        }

        if (!Exists(this.promotion_description)) {
            this.validation_errors['promotion_description'] = "Promotion description cannot be empty"
        }

        if (!Exists(this.promotion_date) || !isValidDate(this.promotion_date)) {
            this.validation_errors['promotion_date'] = "Please enter a valid date"
        }

        if (!Exists(this.end_date) || !Exists(this.start_date)) {
            this.validation_errors['end_date'] = "This is required";
            this.validation_errors['start_date'] = "This is required";
        } else if (this.start_date > this.end_date) {
            this.validation_errors['end_date'] = "Start-date cannot be higher than end-date";
        }

        if (!Exists(this.promotion_city)) {
            this.validation_errors['promotion_city'] = "Please enter a city"
        }

        if (!Exists(this.promotion_postalcode)) {
            this.validation_errors['promotion_postalcode'] = "Please enter a postal code"
        }

        if (!Exists(this.promotion_address)) {
            this.validation_errors['promotion_address'] = "Please enter a address for the promotion"
        }

        if (!Exists(this.host_name)) {
            this.validation_errors['host_name'] = "Please enter a name"
        }

        if (!Exists(this.host_surname)) {
            this.validation_errors['host_surname'] = "Please enter a surname"
        }

        if (!Exists(this.host_phonenumber)) {
            this.validation_errors['host_phonenumber'] = "Please enter a phone number"
        }

        if (!Exists(this.host_email) || !isValidEmail(this.host_email)) {
            this.validation_errors['host_email'] = "Please enter a email"
        }

        let errors = Object.keys(this.validation_errors).length;
        return errors <= 0;
    }

    save() {

        // save the data into cookies
        document.cookie = "name=promotion_cookie;";
        document.cookie = "path=" + encodeURIComponent("promotion_crud.html") + ';';
        document.cookie = "host_name=" + encodeURIComponent(this.host_name) + ';';
        document.cookie = "host_surname=" + encodeURIComponent(this.host_surname) + ';';
        document.cookie = "host_email=" + encodeURIComponent(this.host_email) + ';';
        document.cookie = "host_phonenumber=" + encodeURIComponent(this.host_phonenumber) + ';';
        var date = new Date();
        date.setTime(date.getTime() + (365 * 24 * 60 * 60 * 1000));
        document.cookie = "expires=" + date.toGMTString() + ';';

        // save data to local storage
        let promotions = localStorage.getItem('promotions');
        promotions = Exists(promotions) ? JSON.parse(promotions) : {}

        let promo_name = this.promotion_name + "__" + this.promotion_date;
        promotions[promo_name] = {
            'promotion_name': this.promotion_name,
            'promotion_type': this.promotion_type,
            'promotion_description': this.promotion_description,
            'promotion_date': this.promotion_date,
            'start_date': this.start_date,
            'end_date': this.end_date,
            'promotion_city': this.promotion_city,
            'promotion_postalcode': this.promotion_postalcode,
            'promotion_address': this.promotion_address,
            'host_name': this.host_name,
            'host_surname': this.host_surname,
            'host_phonenumber': this.host_phonenumber,
            'host_email': this.host_email,
            'cooldrink': this.cooldrink,
            'tea': this.tea,
            'sandwhich': this.sandwhich
        }
        localStorage.setItem('promotions', JSON.stringify(promotions));
        window.alert("promotion successfully saved")
        return true
    }

    set_html_fields() {
        // update the fields with values
        document.promotionForm.promotion_name.value = this.promotion_name;
        document.promotionForm.promotion_description.value = this.promotion_description;
        document.promotionForm.promotion_date.value = this.promotion_date;
        document.promotionForm.start_date.value = Exists(this.start_date) ? this.start_date : "00:00";
        document.promotionForm.end_date.value = Exists(this.end_date) ? this.end_date : "00:00";

        document.promotionForm.promotion_city.value = this.promotion_city;
        document.promotionForm.promotion_postalcode.value = this.promotion_postalcode;
        document.promotionForm.promotion_address.value = this.promotion_address;
        document.promotionForm.host_name.value = this.host_name;
        document.promotionForm.host_surname.value = this.host_surname;
        document.promotionForm.host_phonenumber.value = this.host_phonenumber;
        document.promotionForm.host_email.value = this.host_email;
        document.promotionForm.promotion_type.value = this.promotion_type;

        document.promotionForm.cooldrink.checked = this.cooldrink;
        document.promotionForm.tea.checked = this.tea;
        document.promotionForm.sandwhiche.checked = this.sandwhich;
    }

    duration() {
        try {
            let start = this.start_date.split(":")
            let end = this.end_date.split(":")
            let startDate = new Date(0, 0, 0, start[0], start[1], 0, 0);
            let endDate = new Date(0, 0, 0, end[0], end[1], 0, 0);
            let duration = endDate.getTime() - startDate.getTime()
            let duration_date = new Date(0, 0, 0, 0, 0, 0, duration);
            let final_duration = ["Duration: ", duration_date.getHours(), "H and ", duration_date.getMinutes(), 'M']
            return final_duration.join("")
        } catch (err) {
            throw err
        }
    }

    set_total_price_for_items(promotionName) {
        let attendees = Exists(localStorage["attendees__" + promotionName]) ? JSON.parse(localStorage["attendees__" + promotionName]) : []
        let total_cost = 0;

        for (let attendee in attendees) {
            let items = attendees[attendee].splice(-1)
            if (items[0]) {
                let item_list = items[0].split(";")
                item_list = item_list.filter(function (el) {
                    return el != "";
                });

                for (let foodItemIndex in item_list) {
                    if (item_list[foodItemIndex] === 'tea') {
                        total_cost += ITEMS["TEA"]
                    }

                    if (item_list[foodItemIndex] === 'cooldrink') {
                        total_cost += ITEMS["COOL_DRINK_PRICE"]
                    }

                    if (item_list[foodItemIndex] === 'sandwhich') {
                        total_cost += ITEMS["SANDWHICHES"]
                    }
                }
            }
        }
        let price_element = document.getElementById("price_total")
        price_element.innerText += (" R" + total_cost)
    }

    build_attendee_table(promotionName) {
        // create the header
        let table = document.getElementById("attendee_table")
        let data = ["name", "surname", "phone number", "email", "comment", "items ordered"]
        let thead = table.createTHead();
        let row = thead.insertRow();
        for (let key of data) {
            let th = document.createElement("th");
            let text = document.createTextNode(key);
            th.appendChild(text);
            row.appendChild(th);
        }

        // create the row
        let attendees = Exists(localStorage["attendees__" + promotionName]) ? JSON.parse(localStorage["attendees__" + promotionName]) : []
        this.__createRow(table, attendees)
    }

    __createRow(table, data) {
        for (let data_row of data) {
            let row = table.insertRow();
            for (let item in data_row) {
                let cell = row.insertCell();
                let text = document.createTextNode(data_row[item]);
                cell.appendChild(text);
            }
        }
    }

    full_name() {
        return this.host_name + " " + this.host_surname
    }

    static clear_html_errors() {
        let elements = document.querySelectorAll("[id^='error_message']")

        for (let i = 0; i < elements.length; i++) {
            elements[i].remove();
        }
    }

    static get_all_promotions() {
        let promotions = localStorage["promotions"];
        this.promotions = Exists(promotions) ? JSON.parse(promotions) : {};
        return this.promotions;
    }

    static get_food_items_for_promotion(promotion) {
        let promotions = localStorage["promotions"];
        this.promotions = Exists(promotions) ? JSON.parse(promotions) : {};
        let promotion_name = promotion;

        if (!Exists(promotion)) {
            let promotion_names = Object.keys(this.promotions)
            promotion_name = promotion_names[0]
        }

        const promo_dict = this.promotions[promotion_name]

        let items_to_be_served = []
        if (promo_dict["tea"]) {
            items_to_be_served.push("tea")
        }
        if (promo_dict["sandwhich"]) {
            items_to_be_served.push("sandwhich")
        }
        if (promo_dict["cooldrink"]) {
            items_to_be_served.push("cooldrink")
        }
        return items_to_be_served
    }

}

// validation functions below
function isValidDate(value) {
    // value format has to be yyyy-mm-dd
    let date = value.split('-')
    let year = date[0]
    let month = parseInt(date[1]) - 1
    let day = date[2]

    let future_date = new Date(year, month, day);
    let current_date = new Date();
    return !(future_date.getTime() < current_date.getTime());
}

function isValidEmail(email) {
    return !(email.search(/@/) === -1 || email.lastIndexOf(".") === -1);
}

function Exists(value) {
    if (isString(value)) {
        value = value.trim()
    }

    if (value === "") {
        return false
    } else if (value === undefined) {
        return false
    } else if (value === null) {
        return false
    }
    return true
}

function isString(value) {
    return Object.prototype.toString.call(value) === '[object String]';
}


window.onload = function () {

    // Enlarges Image
    document.querySelectorAll('img.gallery-image').forEach(item => {
        item.addEventListener('click', function () {
            this.classList.toggle('gallery-image-large');
        });
    })

    // Rotates Image
    document.querySelectorAll('[name=rotate_image]').forEach(item => {
        item.addEventListener('click', function () {
            let img_element = item.previousElementSibling;
            img_element.classList.toggle('rotate');
        });
    })

    // Clear input fields
    document.querySelectorAll('[id=reset_page]').forEach(item => {
        item.addEventListener('click', function () {
            Promotion.clear_html_errors()  // TODO add code that removes the red line around the box when there is a error
        });
    })

    // Populate promotion list
    let promo_list = document.getElementById("promotion_list")
    if (Exists(promo_list)) {
        let promotions = Promotion.get_all_promotions()
        for (let promo in promotions) {
            let promo_array = promo.split("__")
            let option = document.createElement('option');
            option.innerHTML = promo_array[0];
            option.setAttribute('name', promo);
            promo_list.appendChild(option)
        }
    }

    // Update Existing promotion
    document.querySelectorAll('[id=update_promo]').forEach(item => {
        item.addEventListener('click', function () {
            update_promo()
        });
    })

    // Delete Existing promotion
    document.querySelectorAll('[id=delete_promo]').forEach(item => {
        item.addEventListener('click', function () {
            delete_promo()
        });
    })

    // populate the calendar table
    let cal_table = document.getElementById("calendar_table")
    if (Exists(cal_table)) {
        let cal_instance = new Calendar(cal_table)
        cal_instance.build_table()
    }


    // Populate Attendee Table
    let attendee_table = document.getElementById("attendee_table");
    if (Exists(attendee_table)) {
        let promotions = Promotion.get_all_promotions()
        let url = new URL(window.location.href);
        let promotionName = url.searchParams.get("promotionName");
        let promo_instance = new Promotion(null, promotions[promotionName]);
        promo_instance.build_attendee_table(promotionName)

        let promo_p_element = document.getElementById("promotion_ptag")
        promo_p_element.insertAdjacentHTML("afterend",
            "<p class='mt-2'><span class='bold underline'>Host Name</span></p>" + "<p class='mt-2'>" + promo_instance.full_name() + "</p>" +
            "<p class='mt-2'><span class='bold underline'>Host Number</span></p>" + "<p class='mt-2'>" + promo_instance.host_phonenumber + "</p>" +
            "<p class='mt-2'><span class='bold underline'>Host Email</span></p>" + "<p class='mt-2'>" + promo_instance.host_email + "</p>" +
            "<p class='mt-2'><span class='bold underline'>Promotion Description</span></p>" + "<p class='mt-2'>" + promo_instance.promotion_description + "</p>"
        )

        promo_instance.set_total_price_for_items(promotionName)
    }

    // Move the image gallery
    let img_back = document.getElementById("img_back");
    let img_forward = document.getElementById("img_forward");
    if (Exists(img_back) && Exists(img_forward)) {
        img_back.addEventListener("click", () => push_gallery("back"))
        img_forward.addEventListener("click", () => push_gallery("forward"))
    }


    // validate promotion form
    let promotionForm = document.getElementById("promotion_form")
    if (Exists(promotionForm)) {
        promotionForm.addEventListener("submit", (e) => validate_promotion(e))
    }

    // validate signup form
    let signUpForm = document.getElementById("sign_up_form")
    if (Exists(signUpForm)) {
        signUpForm.addEventListener("submit", (e) => validate_attendee(e))
    }


    let promotionFoodItemsSelect = document.getElementById("promotion_items")
    if (Exists(promotionFoodItemsSelect)) {

        // check if the promotion name is populated
        let items = Promotion.get_food_items_for_promotion(null)
        let itemBox = document.getElementById("promotion_items")

        for (let item_index in items) {
            let item = items[item_index]
            let option_element = document.createElement("option")
            option_element.text = item
            itemBox.add(option_element)
        }

        let promotionList = document.getElementById("promotion_list")
        promotionList.addEventListener("change", () => update_promotion_items())
    }

}
