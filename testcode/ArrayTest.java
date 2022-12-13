class ArrayTest {
    public static void main(String args[]) {
        System.out.println("int");
        int in[] = new int[10];
        in[2] = 15;
        for (int i = 0; i < 10; i++) {
            System.out.println(in[i]);
        }

        System.out.println("long");
        long l[] = new long[10];
        l[2] = 15L;
        for (int i = 0; i < 10; i++) {
            System.out.println(l[i]);
        }

        System.out.println("float");
        float f[] = new float[10];
        f[2] = 15.0F;
        for (int i = 0; i < 10; i++) {
            System.out.println(f[i]);
        }

        System.out.println("double");
        double d[] = new double[10];
        d[2] = 15.0D;
        for (int i = 0; i < 10; i++) {
            System.out.println(d[i]);
        }

        System.out.println("boolean");
        boolean b[] = new boolean[10];
        b[2] = true;
        for (int i = 0; i < 10; i++) {
            System.out.println(b[i]);
        }

        System.out.println("char");
        char c[] = new char[10];
        c[2] = 'a';
        for (int i = 0; i < 10; i++) {
            System.out.println(c[i]);
        }

        System.out.println("short");
        short s[] = new short[10];
        s[2] = 1;
        for (int i = 0; i < 10; i++) {
            System.out.println(s[i]);
        }
    }
}