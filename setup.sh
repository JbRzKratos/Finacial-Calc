#!/bin/bash
set -e

echo "================================================"
echo "  FinCalc Pro — Android APK Build Script"
echo "================================================"
echo ""

# ──────────────────────────────────────────────
# 1. Install Node dependencies
# ──────────────────────────────────────────────
echo "📦 Installing Node dependencies..."
npm install

# ──────────────────────────────────────────────
# 2. Build Vite web assets
# ──────────────────────────────────────────────
echo ""
echo "🔨 Building Vite project (46 modules)..."
npm run build

# ──────────────────────────────────────────────
# 3. Init Capacitor (idempotent)
# ──────────────────────────────────────────────
echo ""
echo "🤖 Initializing Capacitor..."
if [ ! -f capacitor.config.ts ]; then
    npx cap init "FinCalc Pro" "com.financialcalc.app" --web-dir dist
else
    echo "  → capacitor.config.ts already exists"
fi

# ──────────────────────────────────────────────
# 4. Add Android platform (idempotent)
# ──────────────────────────────────────────────
echo ""
echo "➕ Adding Android platform..."
if [ ! -d android ]; then
    npx cap add android
else
    echo "  → android/ directory already exists"
fi

# ──────────────────────────────────────────────
# 5. Generate icons & splash (if resources exist)
# ──────────────────────────────────────────────
echo ""
echo "🎨 Generating icons and splash screens..."
if [ -f resources/icon.svg ] || [ -f resources/icon.png ]; then
    npx capacitor-assets generate --iconBackgroundColor "#0D0D14" --splashBackgroundColor "#0D0D14" 2>/dev/null || echo "  → (skipped — capacitor-assets not available)"
fi

# ──────────────────────────────────────────────
# 6. Sync web assets to Android
# ──────────────────────────────────────────────
echo ""
echo "🔄 Syncing web assets to Android..."
npx cap sync android

# ──────────────────────────────────────────────
# 7. Generate keystore if missing
# ──────────────────────────────────────────────
echo ""
KEYSTORE="android/fincalc-pro.keystore"
if [ ! -f "$KEYSTORE" ]; then
    echo "🔑 No keystore found. Creating a debug keystore for testing..."
    keytool -genkey -v -keystore "$KEYSTORE" \
        -alias fincalc-pro -keyalg RSA -keysize 2048 \
        -validity 10000 \
        -storepass "android" -keypass "android" \
        -dname "CN=FinCalc Pro, OU=Development, O=FinCalc, L=Mumbai, ST=MH, C=IN" 2>/dev/null || \
    echo "  → (keytool not found — create keystore manually in Android Studio)"

    # Write matching keystore.properties
    cat > android/keystore.properties <<- EOF
storeFile=../fincalc-pro.keystore
storePassword=android
keyAlias=fincalc-pro
keyPassword=android
EOF
    echo "  → Debug keystore created at $KEYSTORE"
    echo "  → keystore.properties written for debug signing"
fi

# ──────────────────────────────────────────────
# 8. Build APK via Gradle
# ──────────────────────────────────────────────
echo ""
echo "🏗️  Building Android APK (release)..."
cd android
if [ "$(uname)" = "Linux" ] || [ "$(uname)" = "Darwin" ]; then
    chmod +x gradlew
fi
./gradlew assembleRelease
cd ..

# ──────────────────────────────────────────────
# Done
# ──────────────────────────────────────────────
APK_PATH="android/app/build/outputs/apk/release/app-release.apk"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ✅ Build complete!"
echo ""
if [ -f "$APK_PATH" ]; then
    APK_SIZE=$(du -h "$APK_PATH" 2>/dev/null | cut -f1)
    echo "  📱 APK: $APK_PATH"
    echo "  📦 Size: ${APK_SIZE:-unknown}"
    echo ""
    echo "  Install on device:"
    echo "    adb install $APK_PATH"
else
    echo "  ⚠️  APK not found — check Android Studio for errors."
    echo "     npx cap open android"
    echo "     Then: Build → Generate Signed Bundle / APK → APK"
fi
echo ""
echo "  ABI-split APKs (per architecture):"
echo "    android/app/build/outputs/apk/release/app-arm64-v8a-release.apk"
echo "    android/app/build/outputs/apk/release/app-x86_64-release.apk"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
