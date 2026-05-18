# FinCalc Pro — ProGuard / R8 rules

# Keep Capacitor bridge classes
-keep class com.getcapacitor.** { *; }
-keep class com.getcapacitor.plugin.** { *; }
-keep class com.getcapacitor.community.** { *; }

# Keep plugin bridge methods (reflection)
-keepclassmembers class * extends com.getcapacitor.Plugin {
    @com.getcapacitor.annotation.PluginMethod public <methods>;
}

# Keep AndroidX / WebView internals
-keep class androidx.webkit.** { *; }

# Keep JavaScript interface
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# Keep plugin native references
-keep class com.financialcalc.app.** { *; }

# Keep JS bridge
-keep class * implements com.getcapacitor.BridgeMessage { *; }

# Remove logging in release (already done via terser, but belt-and-suspenders)
-assumenosideeffects class android.util.Log {
    public static boolean isLoggable(java.lang.String, int);
    public static int v(...);
    public static int d(...);
    public static int i(...);
    public static int w(...);
}
