/**
Name: John Wesley Agojo
johnwesley_agojo@student.uml.edu

Date: 11/26/2025
File: script.js
Assignment:
    This assignment requires the creation of a dynamic multiplication table generator
    PART 1: Implementing jQuery Validation plugin for client-side validation.
    Part 2: Adding jQuery UI sliders for input selection along with tabs for multiple tables.
**/

$(document).ready(function() {
    console.log("Doc is ready, initializing form validation.");
    
    let tabCounter = 0;
    $("#tabs").tabs();

    initializeSlider("#slider-minColumn", "#minColumn", -50, 50, 0);
    initializeSlider("#slider-maxColumn", "#maxColumn", -50, 50, 0);
    initializeSlider("#slider-minRow", "#minRow", -50, 50, 0);
    initializeSlider("#slider-maxRow", "#maxRow", -50, 50, 0);

    function initializeSlider(sliderSelector, inputSelector, min, max, defaultValue) {
        $(sliderSelector).slider({
            min: min,
            max: max,
            value: defaultValue,
            slide: function(event, ui) {
                $(inputSelector).val(ui.value).trigger('change');
            },
            stop: function() {
                $(inputSelector).valid();
            }
        });
        $(inputSelector).on('input', function() {
            let value = $(this).val();
            if (value !== '' && !isNaN(value)) {
                value = parseFloat(value);
                if (value >= min && value <= max) {
                    $(sliderSelector).slider('value', value);
                }
            }
        });
    }
    $.validator.addMethod("greaterThanMin", function(value, element, param) {
        var minValue = $(param).val();
        return this.optional(element) || parseFloat(value) >= parseFloat(minValue);
    }, "Maximum value must be greater than or equal to minimum value.");
    
    $("#table-form").validate({
        rules: {
            "minColumn": {
                required: true,
                number: true,
                range: [-50, 50]
            },
            "maxColumn": {
                required: true,
                number: true,
                range: [-50, 50],
                greaterThanMin: "#minColumn"
            },
            "minRow": {
                required: true,
                number: true,
                range: [-50, 50]
            },
            "maxRow": {
                required: true,
                number: true,
                range: [-50, 50],
                greaterThanMin: "#minRow"
            }
        },
        messages: {
            "minColumn": {
                required: "Min value for column is required.",
                number: "Please enter a valid number."
            },
            "maxColumn": {
                required: "Max value for column is required.",
                number: "Please enter a valid number.",
                greaterThanMin: "Maximum column value must be greater than or equal to minimum column value."
            },
            "minRow": {
                required: "Min value for row is required.",
                number: "Please enter a valid number.",
            },
            "maxRow": {
                required: "Max value for row is required.",
                number: "Please enter a valid number.",
                greaterThanMin: "Maximum row value must be greater than or equal to minimum row value."
            }
        },
        errorPlacement: function(error, element) {
            console.log("Placing error for element:", element.attr("id"));
            error.addClass("error-message");
            error.insertAfter(element.parent());
        },
        submitHandler: function() {
            console.log("Form is valid, generating table.");
            generateTable();
        }
    });

    $("#delete-selected-tab").on('click', function() {
        let tabs = $("#tabs").tabs();
        let activeTab = tabs.tabs("option", "active");
        
        if (activeTab !== false && $("#tabs-list li").length > 0) {
            let tabId = $("#tabs-list li").eq(activeTab).remove().attr("aria-controls");
            $("#" + tabId).remove();
            tabs.tabs("refresh");
        }
    });

    $("#delete-all-tabs").on('click', function() {
        $("#tabs-list").empty();
        $("#tabs div[id^='tab-']").remove();
        $("#tabs").tabs("refresh");
        tabCounter = 0;
    });

    function generateTable() {
        $("#error-message").text("");
        const minCol = parseFloat($("#minColumn").val());
        const maxCol = parseFloat($("#maxColumn").val());
        const minRow = parseFloat($("#minRow").val());
        const maxRow = parseFloat($("#maxRow").val());
        
        tabCounter++;
        const tabId = "tab-" + tabCounter;
        const tabLabel = `[${minCol}, ${maxCol}] x [${minRow}, ${maxRow}]`;
        
        $("#tabs-list").append(
            `<li><a href="#${tabId}">${tabLabel}</a></li>`
        );
        
        $("#tabs").append(
            `<div id="${tabId}"></div>`
        );

        let table = $("<table></table>");
        let thead = $("<thead></thead>");
        let tbody = $("<tbody></tbody>");
        let headerRow = $("<tr></tr>");
        headerRow.append($("<th></th>"));
        for (let i = minCol; i <= maxCol; i++) {
            headerRow.append($("<th></th>").text(i));
        }
        
        thead.append(headerRow);
        table.append(thead);
        for (let i = minRow; i <= maxRow; i++) {
            let bodyRow = $("<tr></tr>");
            bodyRow.append($("<th></th>").text(i));
            
            for (let j = minCol; j <= maxCol; j++) {
                bodyRow.append($("<td></td>").text(i * j));
            }
            
            tbody.append(bodyRow);
        }
        table.append(tbody);
        $("#" + tabId).append(table);
        
        $("#tabs").tabs("refresh");
        $("#tabs").tabs("option", "active", tabCounter - 1);
    }
});