import java.util.Arrays;

public class GeometricSequence {
    /*
     * Finds the longest geometrically increasing (strictly) subsequence of an
     * array.
     * 
     * You may copy code from lis() and modify it. You may also start from scratch, but we think LIS will be useful.
     * 
     * @param nums A list of distinct numbers.
     * 
     * @returns The longest geometrically increasing subsequence itself. If there
     * are multiple, then any will work.
     */
    public static int[] lgis(int[] nums) {
        // TODO: complete this method.
        int size = lis(nums); 
        int[] retVal = new int[size - 1];
        int curr = 0; 



        int[][] vals = new int[nums.length][nums.length + 1];
        int m = -417;
        for (int j = 0; j < nums.length; j++) {
            vals[0][j] = (nums[0] < nums[j]) ? 1 : 0;
            if (nums[0] < nums[j]) {
                System.out.println("This was what we are putting in for stage 1 index 1: " + nums[j]); 
                // retVal[curr] = nums[j];
                // curr++;
            }
            // m is being updated STAGE 1
            m = Math.max(m, vals[0][j]);
            // System.out.println("This is what max m is for Stage 1: " + m);

        }
        // System.out.println("Last thing in index 1: " + retVal[0]);
	    vals[0][nums.length] = 1;
        // m is being updated STAGE 2
	    m = Math.max(m, vals[0][nums.length]);
        // System.out.println("This is what max m is for Stage 2: " + m);

        for (int i = 1; i < nums.length; i++) {
            for (int j = 0; j < nums.length; j++) {
                if (nums[i] >= nums[j]) {
                    vals[i][j] = vals[i - 1][j];
                    // System.out.println("This was what we are putting in for stage 2.5 index 1: " + nums[i]); 
                    if (curr > 0 && nums[i] > retVal[curr - 1]) {
                        retVal[curr] = nums[i]; 
                        System.out.println("retval was updated with " + nums[i] + " at index " + curr); 
                        curr++; 
                    }
                } else {
                    // curr = 0; 
                    vals[i][j] = Math.max(1 + vals[i - 1][i], vals[i - 1][j]);
                    // System.out.println("This was the other thing for stage 2.5 index 1: " + nums[i]); 
                    if (curr > 0 && nums[i] > retVal[curr - 1]) {
                        retVal[curr] = nums[i]; 
                        System.out.println("retval was (greater) updated with " + nums[i] + " at index " + curr); 
                        curr++; 
                    } 
                    //else if (curr > 0 && nums[i] <= retVal[curr - 1]) {
                        // retVal[curr] = nums[i]; 
                        // System.out.println("retval was (less equal) updated with " + nums[i] + " at index " + curr); 
                        // curr++; 
                    //} 
                    else {
                        curr = 0; 
                        retVal[curr] = nums[i]; 
                        System.out.println("retval was (else) updated with " + nums[i] + " at index " + curr); 
                        curr++; 
                    }
                }
                // m is being updated STAGE 3
                m = Math.max(m, vals[i][j]);
                // System.out.println("This is what we are putting in for Stage 3: " + );
                if (vals[i][j] > m) {
                    System.out.println("h");
                    retVal[curr] = vals[i][j];	
                    curr++;   
                }
            }
	        vals[i][nums.length] = Math.max(1 + vals[i-1][i], vals[i-1][nums.length]);
            // m is being updated STAGE 4
            m = Math.max(m, vals[i][nums.length]);	  
            // System.out.println("This is what max m is for Stage 4: " + m);
            
        }
        return retVal;
    }

    /*
     * Reference: longest increasing (strictly) subsequence code.
     * 
     * @param nums A list of distinct numbers.
     * 
     * @returns the LENGTH of the longest increasing subsequence.
     */
    public static int lis(int[] nums) {
        int[][] vals = new int[nums.length][nums.length + 1];
        int m = -417;
        for (int j = 0; j < nums.length; j++) {
            vals[0][j] = (nums[0] < nums[j]) ? 1 : 0;
            // m is being updated
            m = Math.max(m, vals[0][j]);
        }
	    vals[0][nums.length] = 1;
        // m is being updated
	    m = Math.max(m, vals[0][nums.length]);

        for (int i = 1; i < nums.length; i++) {
            for (int j = 0; j < nums.length; j++) {
                if (nums[i] >= nums[j])
                    vals[i][j] = vals[i - 1][j];
                else {
                    vals[i][j] = Math.max(1 + vals[i - 1][i], vals[i - 1][j]);
                }
                // m is being updated
                m = Math.max(m, vals[i][j]);
            }
	        vals[i][nums.length] = Math.max(1 + vals[i-1][i], vals[i-1][nums.length]);
            // m is being updated
            m = Math.max(m, vals[i][nums.length]);	    
        }
        return m;
    }

    public static void main(String[] args) {
        
        // expected: [1, 4]
        run(new int[] { 1, 2, 4 });

        // expected: [1, 34] or [2, 34]
        run(new int[] { 1, 2, 34 });

        // expected: [1, 34] or [2, 34]
        run(new int[] { 100, 1, 2, 34 });

        // add more test cases below!
    }

    public static void run(int[] arr) {
        System.out.println(Arrays.toString(lgis(arr)));
    }
}