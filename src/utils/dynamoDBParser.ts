/**
 * Utility functions to parse DynamoDB formatted data
 */

/**
 * Parse a DynamoDB formatted item into a plain JavaScript object
 * @param item DynamoDB formatted item
 * @returns Plain JavaScript object
 */
export const parseDynamoDBItem = (item: any): any => {
  if (!item) return null;
  
  const result: any = {};
  
  Object.keys(item).forEach(key => {
    result[key] = parseDynamoDBAttribute(item[key]);
  });
  
  return result;
};

/**
 * Parse a DynamoDB attribute value
 * @param attribute DynamoDB attribute
 * @returns Parsed value
 */
export const parseDynamoDBAttribute = (attribute: any): any => {
  // Handle simple types
  if (attribute.S !== undefined) return attribute.S;
  if (attribute.N !== undefined) return Number(attribute.N);
  if (attribute.BOOL !== undefined) return attribute.BOOL;
  if (attribute.NULL !== undefined) return null;
  
  // Handle lists
  if (attribute.L !== undefined) {
    return attribute.L.map((item: any) => parseDynamoDBAttribute(item));
  }
  
  // Handle maps
  if (attribute.M !== undefined) {
    const map: any = {};
    Object.keys(attribute.M).forEach(key => {
      map[key] = parseDynamoDBAttribute(attribute.M[key]);
    });
    return map;
  }
  
  // Handle string sets, number sets, binary sets
  if (attribute.SS !== undefined) return attribute.SS;
  if (attribute.NS !== undefined) return attribute.NS.map(Number);
  if (attribute.BS !== undefined) return attribute.BS;
  
  // Return the original attribute if no matching type
  return attribute;
};

/**
 * Parse a list of DynamoDB items
 * @param items List of DynamoDB formatted items
 * @returns Array of parsed items
 */
export const parseDynamoDBItems = (items: any[]): any[] => {
  if (!items || !Array.isArray(items)) return [];
  return items.map(item => parseDynamoDBItem(item));
};

/**
 * Convert a plain JavaScript object to DynamoDB format
 * @param item Plain JavaScript object
 * @returns DynamoDB formatted item
 */
export const toDynamoDBItem = (item: any): any => {
  if (!item) return null;
  
  const result: any = {};
  
  Object.keys(item).forEach(key => {
    result[key] = toDynamoDBAttribute(item[key]);
  });
  
  return result;
};

/**
 * Convert a JavaScript value to DynamoDB attribute format
 * @param value JavaScript value
 * @returns DynamoDB attribute
 */
export const toDynamoDBAttribute = (value: any): any => {
  // Handle null or undefined
  if (value === null || value === undefined) {
    return { NULL: true };
  }
  
  // Handle string
  if (typeof value === 'string') {
    return { S: value };
  }
  
  // Handle number
  if (typeof value === 'number') {
    return { N: value.toString() };
  }
  
  // Handle boolean
  if (typeof value === 'boolean') {
    return { BOOL: value };
  }
  
  // Handle array
  if (Array.isArray(value)) {
    return { L: value.map(item => toDynamoDBAttribute(item)) };
  }
  
  // Handle object
  if (typeof value === 'object') {
    const map: any = {};
    Object.keys(value).forEach(key => {
      map[key] = toDynamoDBAttribute(value[key]);
    });
    return { M: map };
  }
  
  // Default fallback
  return { S: String(value) };
};

/**
 * Format DynamoDB financial ratios for display
 * This specifically handles the nested structure of financial ratios
 */
export const formatFinancialRatios = (dynamoDBRatios: any): any[] => {
  if (!dynamoDBRatios || !dynamoDBRatios.M) return [];
  
  const parsedRatios = parseDynamoDBAttribute(dynamoDBRatios);
  const formattedRatios: any[] = [];
  
  // Process each category of ratios
  Object.entries(parsedRatios).forEach(([category, metrics]: [string, any]) => {
    // Process each metric in the category
    Object.entries(metrics).forEach(([metric, value]: [string, any]) => {
      // For simple number values, create a standard format
      if (typeof value === 'number') {
        formattedRatios.push({
          category,
          metric,
          value,
          explanation: `${metric} for ${category}`,
          assessment: value > 1 ? 'positive' : value < 0 ? 'negative' : 'neutral'
        });
      } 
      // For complex objects with value and explanation
      else if (typeof value === 'object' && value !== null) {
        formattedRatios.push({
          category,
          metric,
          value: value.value || 0,
          explanation: value.explanation || `${metric} for ${category}`,
          assessment: value.assessment || 'neutral'
        });
      }
    });
  });
  
  return formattedRatios;
};

/**
 * Format DynamoDB performance trends for display
 */
export const formatPerformanceTrends = (dynamoDBTrends: any): any => {
  if (!dynamoDBTrends || !dynamoDBTrends.L) return { revenue: [], profit: [], debt: [] };
  
  const parsedTrends = parseDynamoDBAttribute(dynamoDBTrends);
  
  // Initialize arrays for each trend type
  const revenue: number[] = [];
  const profit: number[] = [];
  const debt: number[] = [];
  
  // Extract trend data from each year's entry
  parsedTrends.forEach((yearData: any) => {
    if (yearData.revenue) revenue.push(Number(yearData.revenue));
    if (yearData.profit) profit.push(Number(yearData.profit));
    if (yearData.debt) debt.push(Number(yearData.debt));
  });
  
  return { revenue, profit, debt };
};

/**
 * Format DynamoDB recommendations for display
 */
export const formatRecommendations = (dynamoDBRecommendations: any): string[] => {
  if (!dynamoDBRecommendations || !dynamoDBRecommendations.L) return [];
  
  const parsedRecommendations = parseDynamoDBAttribute(dynamoDBRecommendations);
  
  // If already an array of strings, return directly
  if (Array.isArray(parsedRecommendations) && 
      parsedRecommendations.every(item => typeof item === 'string')) {
    return parsedRecommendations;
  }
  
  // Otherwise, try to extract strings from complex objects
  return parsedRecommendations
    .map((item: any) => {
      if (typeof item === 'string') return item;
      if (item && item.S) return item.S;
      return null;
    })
    .filter(Boolean);
};

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
