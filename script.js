// Wait for DOM content to load
document.addEventListener('DOMContentLoaded', () => {
    const optionsForm = document.getElementById('optionsForm');
    const mealInputsSection = document.querySelector('.meal-inputs-section');
    const mealGroup = document.getElementById('mealGroup');
    const mealForm = document.getElementById('mealForm');
    const timetableSection = document.querySelector('.timetable-section');
    const mealTableBody = document.querySelector('#mealTable tbody');

    // Function to create input fields for a meal
    function createMealInputs(mealName, count) {
        let fieldset = document.createElement('fieldset');
        let legend = document.createElement('legend');
        legend.textContent = mealName.charAt(0).toUpperCase() + mealName.slice(1);
        fieldset.appendChild(legend);

        for(let i = 1; i <= count; i++) {
            let input = document.createElement('input');
            input.type = 'text';
            input.placeholder = `${mealName.charAt(0).toUpperCase() + mealName.slice(1)} Option ${i}`;
            input.id = `${mealName}${i}`;
            input.required = true;
            fieldset.appendChild(input);
        }

        return fieldset;
    }

    // When user submits the number of options
    optionsForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Clear any existing inputs
        mealGroup.innerHTML = '';

        const numOptions = parseInt(document.getElementById('numOptions').value);

        if (numOptions < 1 || numOptions > 10) {
            alert("Please enter a number between 1 and 10");
            return;
        }

        // Create inputs for each meal
        ['breakfast', 'lunch', 'dinner'].forEach(meal => {
            const mealInputs = createMealInputs(meal, numOptions);
            mealGroup.appendChild(mealInputs);
        });

        mealInputsSection.style.display = 'block';
        timetableSection.style.display = 'none';
    });

    // Generate random dish avoiding same as yesterday
    function getRandomDish(options, yesterdayDish) {
        if (options.length === 1) return options[0]; // only one option

        let todayDish;
        do {
            const randomIndex = Math.floor(Math.random() * options.length);
            todayDish = options[randomIndex];
        } while (todayDish === yesterdayDish);
        return todayDish;
    }

    mealForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Read user inputs dynamically
        function getMealOptions(mealName) {
            let options = [];
            const inputs = mealGroup.querySelectorAll(`input[id^=${mealName}]`);
            inputs.forEach(input => options.push(input.value.trim()));
            return options;
        }

        const breakfastOptions = getMealOptions('breakfast');
        const lunchOptions = getMealOptions('lunch');
        const dinnerOptions = getMealOptions('dinner');

        // Validate inputs again (just in case)
        if (breakfastOptions.some(opt => opt === '') || lunchOptions.some(opt => opt === '') || dinnerOptions.some(opt => opt === '')) {
            alert('Please fill in all meal options.');
            return;
        }

        let yesterdayMeal = { breakfast: "", lunch: "", dinner: "" };
        let mealSchedule = [];

        const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        daysOfWeek.forEach(day => {
            const bf = getRandomDish(breakfastOptions, yesterdayMeal.breakfast);
            const lun = getRandomDish(lunchOptions, yesterdayMeal.lunch);
            const din = getRandomDish(dinnerOptions, yesterdayMeal.dinner);

            yesterdayMeal = { breakfast: bf, lunch: lun, dinner: din };
            mealSchedule.push(yesterdayMeal);
        });

        // Show timetable section
        timetableSection.style.display = 'block';

        // Clear previous table rows
        mealTableBody.innerHTML = '';

        // Populate table with meal schedule
        mealSchedule.forEach((meal, idx) => {
            const row = mealTableBody.insertRow();
            row.innerHTML = `
                <td>${daysOfWeek[idx]}</td>
                <td>${meal.breakfast}</td>
                <td>${meal.lunch}</td>
                <td>${meal.dinner}</td>
            `;
        });

        // Scroll to timetable
        timetableSection.scrollIntoView({ behavior: 'smooth' });
    });
});
