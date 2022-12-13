class MultiAArray {
    public static void main(String args[]) {
        String array[][][] = new String[10][10][10];
        array[0][0][1] = "test";
        array[0][0][9] = "009";
        System.out.println(array[0][0][1]);
        System.out.println(array[0][0][9]);
        System.out.println(array[0][1][2]);
        int intArray[][] = new int[3][4];
        System.out.println(intArray[0][0]);
    }
}