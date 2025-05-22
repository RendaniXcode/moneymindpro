
/**
 * Utility functions to parse AWS DynamoDB formatted data
 */

/**
 * Parse DynamoDB formatted values to JavaScript types
 * @param dynamoValue DynamoDB formatted value
 * @returns Parsed JavaScript value
 */
export const parseDynamoDBValue = (dynamoValue: any): any => {
  if (!dynamoValue) return null;
  
  // String type
  if (dynamoValue.S !== undefined) return dynamoValue.S;
  // Number type
  if (dynamoValue.N !== undefined) return Number(dynamoValue.N);
  // Boolean type
  if (dynamoValue.BOOL !== undefined) return dynamoValue.BOOL;
  // List type
  if (dynamoValue.L !== undefined) return dynamoValue.L.map(parseDynamoDBValue);
  // Map type
  if (dynamoValue.M !== undefined) return parseDynamoDBMap(dynamoValue.M);
  // String Set type
  if (dynamoValue.SS !== undefined) return dynamoValue.SS;
  // Number Set type
  if (dynamoValue.NS !== undefined) return dynamoValue.NS.map(Number);
  
  // Return null for unknown types
  return null;
};

/**
 * Parse DynamoDB M (Map) structure to JavaScript object
 * @param dynamoMap DynamoDB Map structure
 * @returns JavaScript object
 */
export const parseDynamoDBMap = (dynamoMap: Record<string, any>): Record<string, any> => {
  const result: Record<string, any> = {};
  
  for (const key in dynamoMap) {
    result[key] = parseDynamoDBValue(dynamoMap[key]);
  }
  
  return result;
};

/**
 * Parse a complete DynamoDB item into a JavaScript object
 * @param item DynamoDB formatted item
 * @returns JavaScript object representation
 */
export const parseDynamoDBItem = (item: Record<string, any>): Record<string, any> => {
  return parseDynamoDBMap(item);
};

/**
 * Parse financial report data from DynamoDB into application format
 * @param dynamoItem DynamoDB formatted financial report
 * @returns Formatted financial report object
 */
export const parseFinancialReport = (dynamoItem: Record<string, any>) => {
  const parsedItem = parseDynamoDBItem(dynamoItem);
  
  // Parse JSON strings
  if (typeof parsedItem.financialRatios === 'string') {
    try {
      parsedItem.financialRatios = JSON.parse(parsedItem.financialRatios);
    } catch (e) {
      console.error('Error parsing financialRatios', e);
    }
  }
  
  if (typeof parsedItem.recommendations === 'string') {
    try {
      parsedItem.recommendations = JSON.parse(parsedItem.recommendations);
    } catch (e) {
      console.error('Error parsing recommendations', e);
    }
  }
  
  if (typeof parsedItem.performanceTrends === 'string') {
    try {
      parsedItem.performanceTrends = JSON.parse(parsedItem.performanceTrends);
    } catch (e) {
      console.error('Error parsing performanceTrends', e);
    }
  }
  
  return parsedItem;
};
