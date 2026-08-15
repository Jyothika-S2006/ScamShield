import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Share,
  Platform,
  LogBox,
} from 'react-native';

// Disable developer warning overlays on phone
LogBox.ignoreAllLogs(true);

// Live Render Backend
const API_URL = "https://scamshield-uv8u.onrender.com/scan";

const INPUT_TYPES = [
  { id: "SMS", label: "SMS Message", icon: "💬", desc: "Bank & Delivery SMS" },
  { id: "UPI Request", label: "UPI Request", icon: "💳", desc: "GPay / PhonePe Traps" },
  { id: "Voice Message", label: "Voice / Call", icon: "🎙️", desc: "Threats & Unknown Calls" },
  { id: "Link/URL", label: "Website Link", icon: "🔗", desc: "Suspicious Links" },
];

const PRESETS = {
  SMS: [
    "Dear customer, your SBI account will be blocked today. Click sbi-kyc-update.com immediately.",
    "Electricity will be disconnected tonight at 9:30 PM due to unpaid bill. Call officer: 9876543210",
  ],
  "UPI Request": [
    "Payment request of ₹25,000 received from amazon-rewards@okaxis. Enter PIN to receive cash.",
  ],
  "Voice Message": [
    "This is Officer Sharma from Delhi Police. A parcel under your Aadhaar has illegal items. Transfer fee to avoid arrest.",
  ],
  "Link/URL": [
    "https://free-recharge-offer.gift500.in/claim?id=9876",
  ],
};

// On-device intelligent analysis engine
const analyzeLocally = (text) => {
  const lower = text.toLowerCase();
  const isUrgent = ["urgent", "immediately", "expire", "blocked", "disconnect", "suspend", "police", "arrest", "kyc"].some(w => lower.includes(w));
  const hasLink = ["http", "bit.ly", "tinyurl", ".com", ".in", ".xyz"].some(l => lower.includes(l));
  const isUPI = ["enter pin", "cashback", "upi pin", "reward"].some(u => lower.includes(u));

  if ((hasLink && isUrgent) || isUPI) {
    return { score: 0.92, action: "Block & Alert", explanation: "High risk: Combines urgency pressure tactics with unverified links or UPI PIN demands." };
  } else if (hasLink || isUrgent) {
    return { score: 0.55, action: "Verify Carefully", explanation: "Suspicious pattern detected. Verify through official customer care channels." };
  }
  return { score: 0.12, action: "Safe", explanation: "No common scam patterns detected in this message." };
};

export default function App() {
  const [inputType, setInputType] = useState("SMS");
  const [message, setMessage] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [userId] = useState(() => 'user_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 7));

  const getPlaceholder = () => {
    switch (inputType) {
      case "SMS":
        return "Paste the SMS text here... e.g., 'Your bank KYC has expired. Update immediately at link...'";
      case "UPI Request":
        return "Paste the UPI text or message... e.g., 'Receive ₹5,000 cashback by entering PIN...'";
      case "Voice Message":
        return "Type or transcribe what the caller said... e.g., 'They said my parcel is seized and asked for money...'";
      case "Link/URL":
        return "Paste the website URL... e.g., 'bit.ly/claim-lottery-gift'";
      default:
        return "Paste message here to check...";
    }
  };

  const scanMessage = async () => {
    if (!message.trim()) return;

    setLoading(true);
    setResult(null);

    const contextualMessage = `[${inputType}] ${message.trim()}`;

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          text: contextualMessage,
        }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      setResult(data);
      saveHistory(data);
    } catch (error) {
      // Seamless on-device fallback
      const localData = analyzeLocally(contextualMessage);
      setResult(localData);
      saveHistory(localData);
    } finally {
      setLoading(false);
    }
  };

  const saveHistory = (data) => {
    setHistory(prev => [
      {
        id: Date.now(),
        type: inputType,
        preview: message.slice(0, 40) + (message.length > 40 ? "..." : ""),
        action: data.action || "Safe",
        score: data.score,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
      ...prev.slice(0, 3),
    ]);
  };

  const handleShareWarning = async () => {
    if (!result) return;
    try {
      await Share.share({
        message: `🛡️ *ScamShield Family Safety Alert*\n\n` +
          `*Verdict:* ${result.action?.toUpperCase()}\n` +
          `*Risk Level:* ${result.score !== undefined ? Math.round(result.score * 100) + "% Risk" : "Unverified"}\n\n` +
          `*Reason:* ${result.explanation || "Suspected scam message pattern."}\n\n` +
          `*Suspicious Message:* "${message}"\n\n` +
          `⚠️ Please DO NOT send money, enter UPI PIN, or click unknown links!`,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const isBlock = result?.action?.toLowerCase().includes("block");
  const isVerify = result?.action?.toLowerCase().includes("verify");
  const riskPercent = result?.score !== undefined ? Math.round(result.score * 100) : 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.logoRow}>
              <View style={styles.logoBadge}>
                <Text style={styles.logoIcon}>🛡️</Text>
              </View>
              <View>
                <Text style={styles.brandTitle}>ScamShield</Text>
                <Text style={styles.brandTagline}>Family Scam Protection</Text>
              </View>
            </View>
            <View style={styles.safetyPill}>
              <View style={styles.safetyDot} />
              <Text style={styles.safetyText}>Protected</Text>
            </View>
          </View>
        </View>

        {/* INPUT MODE SELECTION */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. What did you receive?</Text>
          <View style={styles.typeGrid}>
            {INPUT_TYPES.map((item) => {
              const active = inputType === item.id;
              return (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.7}
                  style={[styles.typeCard, active && styles.typeCardActive]}
                  onPress={() => {
                    setInputType(item.id);
                    setResult(null);
                  }}
                >
                  <Text style={styles.typeCardIcon}>{item.icon}</Text>
                  <Text style={[styles.typeCardTitle, active && styles.typeCardTitleActive]}>
                    {item.label}
                  </Text>
                  <Text style={styles.typeCardDesc}>{item.desc}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* QUICK DEMO PRESETS */}
        <View style={styles.presetSection}>
          <Text style={styles.presetHeading}>💡 Quick Demo Examples:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.presetRow}>
            {(PRESETS[inputType] || []).map((presetText, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.presetChip}
                onPress={() => setMessage(presetText)}
              >
                <Text style={styles.presetChipText} numberOfLines={1}>
                  Sample {idx + 1}: {presetText.slice(0, 30)}...
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* MESSAGE INPUT CARD */}
        <View style={styles.inputCard}>
          <View style={styles.inputHeader}>
            <Text style={styles.inputTitle}>2. Paste message below</Text>
            {message.length > 0 && (
              <TouchableOpacity onPress={() => { setMessage(""); setResult(null); }}>
                <Text style={styles.clearText}>Clear</Text>
              </TouchableOpacity>
            )}
          </View>

          <TextInput
            style={styles.inputArea}
            placeholder={getPlaceholder()}
            placeholderTextColor="#94A3B8"
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={4}
            editable={!loading}
            textAlignVertical="top"
          />
        </View>

        {/* SCAN BUTTON */}
        <TouchableOpacity
          style={[
            styles.primaryButton,
            (!message.trim() || loading) && styles.buttonDisabled,
          ]}
          onPress={scanMessage}
          disabled={!message.trim() || loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator size="small" color="#FFFFFF" />
              <Text style={styles.buttonText}>Checking with Safety AI...</Text>
            </View>
          ) : (
            <Text style={styles.buttonText}>Check This Message 🔍</Text>
          )}
        </TouchableOpacity>

        {/* RESULT CARD */}
        {result && !loading && (
          <View style={[styles.resultCard, { borderColor: isBlock ? '#FCA5A5' : isVerify ? '#FDE68A' : '#A7F3D0' }]}>
            
            {/* Status Header */}
            <View style={[styles.resultBanner, { backgroundColor: isBlock ? '#FEF2F2' : isVerify ? '#FFFBEB' : '#ECFDF5' }]}>
              <Text style={styles.resultBannerIcon}>{isBlock ? '🛑' : isVerify ? '⚠️' : '✅'}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.resultBannerSub, { color: isBlock ? '#991B1B' : isVerify ? '#92400E' : '#065F46' }]}>
                  {isBlock ? 'DANGEROUS SCAM' : isVerify ? 'SUSPICIOUS - VERIFY' : 'LOOKS SAFE'}
                </Text>
                <Text style={[styles.resultVerdict, { color: isBlock ? '#DC2626' : isVerify ? '#D97706' : '#059669' }]}>
                  {result.action}
                </Text>
              </View>
              <View style={[styles.scoreBadge, { backgroundColor: isBlock ? '#FEE2E2' : isVerify ? '#FEF3C7' : '#D1FAE5' }]}>
                <Text style={[styles.scoreNumber, { color: isBlock ? '#DC2626' : isVerify ? '#D97706' : '#059669' }]}>{riskPercent}%</Text>
                <Text style={styles.scoreSub}>Risk</Text>
              </View>
            </View>

            {/* Risk Gauge */}
            <View style={styles.meterWrapper}>
              <View style={styles.meterTrack}>
                <View
                  style={[
                    styles.meterFill,
                    {
                      width: `${Math.min(Math.max(riskPercent, 10), 100)}%`,
                      backgroundColor: isBlock ? '#DC2626' : isVerify ? '#D97706' : '#059669',
                    },
                  ]}
                />
              </View>
              <View style={styles.meterScale}>
                <Text style={styles.scaleText}>Low Risk</Text>
                <Text style={styles.scaleText}>Moderate</Text>
                <Text style={styles.scaleText}>High Danger</Text>
              </View>
            </View>

            {/* Explanation */}
            <View style={styles.reasonCard}>
              <Text style={styles.reasonHeading}>💬 AI Forensic Explanation:</Text>
              <Text style={styles.reasonText}>
                {result.explanation}
              </Text>
            </View>

            {/* Practical Advice */}
            <View style={styles.adviceBox}>
              <Text style={styles.adviceHeading}>What you should do:</Text>
              {isBlock && (
                <View style={styles.adviceList}>
                  <Text style={styles.adviceItem}>❌ <Text style={styles.bold}>Do not click links</Text> or call back this sender.</Text>
                  <Text style={styles.adviceItem}>🔒 <Text style={styles.bold}>Never enter your UPI PIN</Text> to receive money.</Text>
                  <Text style={styles.adviceItem}>🚨 Report to Cyber Helpline: <Text style={styles.bold}>1930</Text></Text>
                </View>
              )}
              {isVerify && (
                <View style={styles.adviceList}>
                  <Text style={styles.adviceItem}>📞 Contact the institution using their verified official helpline.</Text>
                  <Text style={styles.adviceItem}>⚠️ Do not dial any phone number written in the message.</Text>
                </View>
              )}
              {!isBlock && !isVerify && (
                <View style={styles.adviceList}>
                  <Text style={styles.adviceItem}>✅ No typical scam patterns were found in this message.</Text>
                  <Text style={styles.adviceItem}>💡 Always stay vigilant before sharing personal OTPs or passwords.</Text>
                </View>
              )}
            </View>

            {/* Share to WhatsApp */}
            <TouchableOpacity style={styles.shareBtn} onPress={handleShareWarning} activeOpacity={0.8}>
              <Text style={styles.shareBtnText}>📲 Share Warning with Family on WhatsApp</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* SCAN HISTORY */}
        {history.length > 0 && (
          <View style={styles.historyBox}>
            <Text style={styles.sectionTitle}>Recent Checks</Text>
            {history.map((item) => (
              <View key={item.id} style={styles.historyRow}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={styles.historyType}>{item.type} • {item.time}</Text>
                  <Text style={styles.historyText} numberOfLines={1}>{item.preview}</Text>
                </View>
                <View style={[styles.miniBadge, { backgroundColor: item.action?.includes('Block') ? '#FEE2E2' : item.action?.includes('Verify') ? '#FEF3C7' : '#D1FAE5' }]}>
                  <Text style={[styles.miniBadgeText, { color: item.action?.includes('Block') ? '#DC2626' : item.action?.includes('Verify') ? '#D97706' : '#059669' }]}>
                    {item.action}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* HELPLINE NOTICE */}
        <View style={styles.helpBanner}>
          <Text style={styles.helpIcon}>📞</Text>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.helpTitle}>Suspect Fraud or Lost Money?</Text>
            <Text style={styles.helpSub}>Call India Cyber Crime Helpline: 1930</Text>
          </View>
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>ScamShield • Keeping Indian Families Safe Online</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContainer: {
    paddingHorizontal: 18,
    paddingTop: Platform.OS === 'android' ? 20 : 10,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  logoIcon: {
    fontSize: 22,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1E293B',
  },
  brandTagline: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  safetyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  safetyDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginRight: 6,
  },
  safetyText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#047857',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 10,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  typeCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  typeCardActive: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  typeCardIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  typeCardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  typeCardTitleActive: {
    color: '#1D4ED8',
  },
  typeCardDesc: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  presetSection: {
    marginBottom: 16,
  },
  presetHeading: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 8,
  },
  presetRow: {
    gap: 8,
  },
  presetChip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  presetChipText: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '500',
  },
  inputCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  inputHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  inputTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
  clearText: {
    fontSize: 12,
    color: '#EF4444',
    fontWeight: '600',
  },
  inputArea: {
    minHeight: 90,
    fontSize: 14,
    color: '#0F172A',
    lineHeight: 20,
  },
  primaryButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: '#94A3B8',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 16,
    marginBottom: 24,
  },
  resultBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 14,
  },
  resultBannerIcon: {
    fontSize: 26,
    marginRight: 10,
  },
  resultBannerSub: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  resultVerdict: {
    fontSize: 18,
    fontWeight: '800',
    marginTop: 2,
  },
  scoreBadge: {
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  scoreNumber: {
    fontSize: 16,
    fontWeight: '800',
  },
  scoreSub: {
    fontSize: 9,
    color: '#64748B',
    fontWeight: '600',
  },
  meterWrapper: {
    marginBottom: 14,
  },
  meterTrack: {
    height: 7,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  meterFill: {
    height: '100%',
    borderRadius: 4,
  },
  meterScale: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scaleText: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '600',
  },
  reasonCard: {
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  reasonHeading: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  reasonText: {
    fontSize: 12.5,
    color: '#475569',
    lineHeight: 18,
  },
  adviceBox: {
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  adviceHeading: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 6,
  },
  adviceList: {
    gap: 6,
  },
  adviceItem: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 17,
  },
  bold: {
    fontWeight: '700',
    color: '#0F172A',
  },
  shareBtn: {
    backgroundColor: '#F0FDF4',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  shareBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#15803D',
  },
  historyBox: {
    marginBottom: 18,
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  historyType: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  historyText: {
    fontSize: 12,
    color: '#1E293B',
  },
  miniBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  miniBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  helpBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
    marginBottom: 20,
  },
  helpIcon: {
    fontSize: 20,
  },
  helpTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#92400E',
  },
  helpSub: {
    fontSize: 11,
    color: '#B45309',
    marginTop: 1,
  },
  footer: {
    alignItems: 'center',
    paddingTop: 8,
  },
  footerText: {
    fontSize: 11,
    color: '#94A3B8',
  },
});