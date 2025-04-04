/**
 * @description       : 
 * @author            : ChangeMeIn@UserSettingsUnder.SFDoc
 * @group             : 
 * @last modified on  : 03-21-2025
 * @last modified by  : ChangeMeIn@UserSettingsUnder.SFDoc
**/
public with sharing class PropertyController {
    @AuraEnabled(cacheable=true)
    public static List<Property__c> getProperties(String locationFilter, Decimal minPrice, Decimal maxPrice) {
        String query = 'SELECT Id, Name, Location__c, Price__c, Status__c, Listed_Date__c FROM Property__c WHERE Status__c = \'Available\'';
        
        if (locationFilter != null && locationFilter != '') {
            query += ' AND Location__c LIKE \'%' + locationFilter + '%\'';
        }
        if (minPrice != null) {
            query += ' AND Price__c >= ' + minPrice;
        }
        if (maxPrice != null) {
            query += ' AND Price__c <= ' + maxPrice;
        }

        return Database.query(query);
    }
}
