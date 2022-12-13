import java.util.HashMap;

class MapTest {
    public static void main(String args[]) {
        new MapTest().process();
    }

    void process() {
        HashMap<String,String> map = new HashMap<String, String>();
        map.put("Tanaka", "Taro");
        map.put("Sato", "Hanako");

        if (map.get("Tanaka") == "Yuki") {
            yuki(17);
        } else if (map.get("Tanaka") == "Taro") {
            taro(20);
        }

        System.out.println("Ms.Sato's first name is: " + map.get("Sato"));
    }

    void yuki(int age) {
        System.out.println("My name is Yuki. I'm " + age + " years old.");
    }

    void taro(int age) {
        System.out.println("I'm a " + age + " years old student.");
    }
}