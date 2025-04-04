import { LightningElement, track } from 'lwc';
import getProperties from '@salesforce/apex/PropertyController.getProperties';

export default class PropertyMap extends LightningElement {
    @track properties = [];
    @track mapMarkers = [];
    locationFilter = '';
    @track minPrice = '';
    @track maxPrice = '';
    @track errorMessage = '';

    // Static JSON mapping of localities to latitude & longitude
    localityCoordinates = {
        "Guindy, Chennai": { Latitude: 13.0072, Longitude: 80.2209 },
        "Adyar, Chennai": { Latitude: 13.0067, Longitude: 80.2550 },
        "Velachery, Chennai": { Latitude: 12.9823, Longitude: 80.2200 },
        "Koramangala, Bangalore": { Latitude: 12.9352, Longitude: 77.6245 },
        "Electronic City, Bangalore": { Latitude: 12.8443, Longitude: 77.6605 },
        "Gachibowli, Hyderabad": { Latitude: 17.4381, Longitude: 78.3489 },
        "Banjara hills, Hyderabad": { Latitude: 17.4140, Longitude: 78.4489 }
        // Add more localities here
    };

    handleLocationChange(event) {
        this.locationFilter = event.target.value;
    }

    handleMinPriceChange(event) {
        this.minPrice = event.target.value ? parseFloat(event.target.value) : null;
        this.validatePrices();
    }

    handleMaxPriceChange(event) {
        this.maxPrice = event.target.value ? parseFloat(event.target.value) : null;
        this.validatePrices();
    }

    validatePrices() {
        if (this.minPrice <= 0 || this.maxPrice <= 0) {
            this.errorMessage = "Prices must be greater than 0!";
        } else if (this.minPrice >= this.maxPrice) {
            this.errorMessage = "Minimum Price must be less than Max Price!";
        } else {
            this.errorMessage = "";
        }
    }

    resetValues() {
        this.minPrice = '';
        this.maxPrice = '';
        this.errorMessage = '';
    }

    fetchProperties() {
        getProperties({ locationFilter: this.locationFilter, minPrice: this.minPrice, maxPrice: this.maxPrice })
            .then(result => {
                console.log('Fetched Properties:', result); // Debugging
                this.properties = result;
                this.mapMarkers = result.map(property => {
                    let coords = localityCoordinates[property.Location__c] || { Latitude: 0, Longitude: 0 };
                    return {
                        location: {
                            Latitude: coords.Latitude,
                            Longitude: coords.Longitude
                        },
                        title: property.Name,
                        description: `Price: ${property.Price__c} | Location: ${property.Location__c}`
                    };
                });
            })
            .catch(error => {
                console.error('Error fetching properties:', error);
            });
    }

    connectedCallback() {
        this.fetchProperties();
    }
}
