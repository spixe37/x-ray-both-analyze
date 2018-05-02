const express = require('express');
const request = require('request');
const fs = require("fs")

let app = express();


let data_base;

app.use(express.static("../front"));

app.all('/', (req, resp) => {
    console.log("some info");
});


app.post('/sendmsg', (req, resp) => {
    resp.statusCode = 200;

    input_text = req.param('msg_input');
    data_in = str_to_data(input_text);
    console.log(get_info(data_in));
    resp.send(get_info(data_in));

    
    function get_info(in_arr) {
        let arr = [];
        let all_data = get_all_info(in_arr);
        all_data = all_data.sort(function (a, b) {
            key_a = a[1].procent;
            key_b = b[1].procent;

            if (key_a < key_b) return 1;
            if (key_a > key_b) return -1;
            return 0;
        });
        let out_str = "Вещество: " + all_data[0][0] + " Вероятность: " + all_data[0][1].procent.toFixed(3) + "% Процент содержащегося вещества: " + all_data[0][2].procent.toFixed(3) + "%";
        return out_str;
    }
    function get_all_info(in_arr) {
        let data = find_in_database(in_arr);
        let subs_procentage = Array();

        let out_arr = Array();
        for (let i = 0; i < data[0].length; i++) {
            let name = data[2][i];
            let info_d = data[0][i];
            let info_i = data[1][i];

            out_arr.push([name, info_d, info_i]);
        }


        return out_arr;
    }

    function find_in_database(data_in) {
        let out_arr = Array([], [], []);
        for (const substance in data_base) {
            if (data_base.hasOwnProperty(substance)) {
                let transformed_data = transform_array(data_base[substance]);
                let data_d = data_compare(data_in.transformed[0], transformed_data[0]);
                let data_i = data_compare(data_in.transformed[1], transformed_data[1]);
                out_arr[0].push(data_d);
                out_arr[1].push(data_i);
                out_arr[2].push(substance);
            }
        }
        return out_arr;
    }

    /*
    * Format: [[], []]
    */
    function data_compare(indata, data) {
        length = Math.min(indata.length, data.length);
        let diff = Math.abs(data.length - indata.length);

        success_arr = Array();
        success_ids = Array();
        for (let i = 0; i < length; i++) {
            let diff = Math.abs(get_closest(indata[i], data) - indata[i]);
            success_ids.push(data.indexOf(get_closest(indata[i], data)))
            success_arr.push(diff)
            // success_arr[i] = diff;
        }
        let sum = 100.0;
        let proc = 100.0 / data.length;
        for (let i = 0; i < success_arr.length; i++) {
            sum -= success_arr[i] * proc;
        }
        let out_num = sum - diff * proc;
        return { procent: out_num,  ids: success_ids };
    }
    function transform_array(arr) {
        let transformed = [[], []];
        for (let i = 0; i < arr.length; i++) {
            transformed[0].push(arr[i][0]);
            transformed[1].push(arr[i][1]); 
        }
        return transformed;
    }
    function str_to_data(arg) {
        arg = arg.split('\n')
        transformed_data = [[], []];
        for(let i=0; i < arg.length; i++) {
            let tempArray = arg[i].split(', ');
            for (j=0; j < tempArray.length; j++)
                tempArray[j] = parseFloat(tempArray[j]);
    
            transformed_data[0].push(tempArray[0]);
            transformed_data[1].push(tempArray[1]);
            arg[i] = tempArray;
        }
        return { data: arg, transformed: transformed_data, length: arg.length};
    }
    
    function get_closest(num, array) {
        return array.reduce(function(prev, curr) {
            return (Math.abs(curr - num) < Math.abs(prev - num) ? curr : prev);
        });
    }
    // function find_near_value()
})

app.listen(80, () => {
    let json_string = fs.readFileSync('data.txt', 'utf8');
    
    data_base = JSON.parse(json_string);

    console.log("Server started");
});