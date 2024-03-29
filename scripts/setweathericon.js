export function setIcon(element, weather) {
    switch (weather) {
        case "Clear":
            element.className = "weatherIconFont";
            element.classList.add("fa-solid", "fa-sun");
            break;
        case "Clouds":
            element.className = "weatherIconFont";
            element.classList.add("fa-solid", "fa-cloud");
            break;
        case "Drizzle":
            element.className = "weatherIconFont";
            element.classList.add("fa-solid", "fa-cloud-rain");
            break;
        case "Rain":
            element.className = "weatherIconFont";
            element.classList.add("fa-solid", "fa-cloud-showers-heavy");
            break;
        case "Snow":
            element.className = "weatherIconFont";
            element.classList.add("fa-solid", "fa-snowflake");
            break;
        case "Thunderstorm":
            element.className = "weatherIconFont";
            element.classList.add("fa-solid", "fa-bolt-lightning");
            break;
        case "Tornado":
            element.className = "weatherIconFont";
            element.classList.add("fa-solid", "fa-tornado");
            break;
        default:
            element.className = "weatherIconFont";
            element.classList.add("fa-solid", "fa-smog");
            break;
    }
}