public class Init {
    int intVariable = 0;
    static boolean booleanVariable = false;
    static String stringVariable = "Text";
    static String stringVariable2;

    static {
        stringVariable2 = System.getProperty("os");
    }

    Init() {
        this.booleanVariable = true;
    }

    public static void main(String args[]) {
        System.out.println(stringVariable);
    }

}