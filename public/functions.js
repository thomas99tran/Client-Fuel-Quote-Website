$(document).ready(function() {
    $("input[name='gallons']").on("change, keyup mouseup", function() {
        var current_value = parseInt(this.val())
        var current_price = parseInt($("input[name='price']").val())
        $("input[name='total']").val(current_value * current_price)
    })
})

function login() {
    const username = $("input[name='username']")
    const password = $("input[name='password']")

    $.ajax({
        url: "/login",
        type: "POST",
        data : {
            "username": username.val(),
            "password": password.val()
        },

        success(res) {
            console.log(res)
        },
        error(res) {
            console.log(res)
        }
    })
}

function register() {
    const username = $("input[name='username']")
    const password = $("input[name='password']")

    $.ajax({
        url: "/register",
        type: "POST",
        data : {
            "username": username.val(),
            "password": password.val()
        },

        success(res) {
            console.log(res)
        },
        error(res) {
            console.log(res)
        }
    })
}


function complete_profile() {
    const full_name = $("input[name='fullName']")
    const address = $("input[name='Address1']")
    const address_two = $("input[name='Address2']")
    const city = $("input[name='City']")
    const state = $("input[name='states']")
    const zipcode = $("input[name='Zipcode']")
    
    $.ajax({
        url: "/account",
        type: "POST",
        data : {
            "fullName": full_name.val(),
            "address": address.val(),
            "address_two": address_two.val(),
            "city": city.val(),
            "state": state.val(),
            "zipcode": zipcode.val()
        },

        success(res) {
            console.log(res)
        },
        error(res) {
            console.log(res)
        }
    })
}