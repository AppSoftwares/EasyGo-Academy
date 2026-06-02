package com.example

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.animation.*
import androidx.compose.animation.core.*
import androidx.compose.foundation.*
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.*
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.platform.LocalClipboardManager
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.AnnotatedString
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.ViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.ui.theme.*
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.*
import kotlin.random.Random

// ==========================================
// MODELS & CONFIGURATION
// ==========================================

enum class AppTab { DIAGNOSTICS, PLAYGROUND, PORTFOLIO, ADMIN }

data class AuditEntry(
    val id: String = UUID.randomUUID().toString(),
    val timestamp: String,
    val author: String,
    val action: String,
    val details: String,
    val severity: String = "INFO" // "INFO", "WARN", "CRIT"
)

data class AdminUser(
    val id: String = UUID.randomUUID().toString(),
    val email: String,
    val role: String,
    val level: Int,
    val isBlocked: Boolean = false,
    val lastActive: String
)

enum class Network(
    val displayName: String,
    val rpcUrl: String,
    val nativeSymbol: String,
    val color: Color
) {
    ETH_MAINNET("Ethereum Mainnet", "https://eth.infura.io/v3/node", "ETH", Color(0xFF627EEA)),
    ARBITRUM("Arbitrum One", "https://arb1.arbitrum.io/rpc", "ETH", Color(0xFF28A0F0)),
    POLYGON("Polygon Proof of Stake", "https://polygon-rpc.com", "POL", Color(0xFF8247E5)),
    BASE("Base Mainnet", "https://mainnet.base.org", "ETH", Color(0xFFFFCC00)),
    SEPOLIA("Sepolia Testnet", "https://sepolia.infura.io/v3/test", "sETH", Color(0xFF9062EA))
}

data class LogEntry(
    val id: String = UUID.randomUUID().toString(),
    val time: String,
    val type: String,
    val message: String
)

data class Asset(
    val name: String,
    val symbol: String,
    val balance: Double,
    val priceUsd: Double,
    val priceHistory: List<Float>
)

enum class TxType { CONNECT, SIGN_MESSAGE, SEND_TRANSACTION }

data class DappTransaction(
    val id: String = UUID.randomUUID().toString(),
    val dappName: String,
    val dappUrl: String,
    val type: TxType,
    val description: String,
    val tokenSymbol: String,
    val tokenValue: Double,
    val usdValue: Double,
    val payloadHex: String
)

enum class DiagnosticStatus { SUCCESS, WARNING, ERROR, PENDING }

data class DiagnosticItem(
    val id: String,
    val title: String,
    val description: String,
    val status: DiagnosticStatus,
    val recommendation: String,
    val fixActionName: String? = null
)

enum class GasPreference { ECO, MARKET, AGGRESSIVE }

// ==========================================
// VIEWMODEL FOR STATE MANAGEMENT
// ==========================================

class Web3ViewModel : ViewModel() {
    private val _selectedTab = MutableStateFlow(AppTab.DIAGNOSTICS)
    val selectedTab: StateFlow<AppTab> = _selectedTab.asStateFlow()

    private val _walletAddress = MutableStateFlow("0x7F2A9d82121E9Ef782D4d209CcA2a5F2bc0b9871D6")
    val walletAddress: StateFlow<String> = _walletAddress.asStateFlow()

    private val _activeNetwork = MutableStateFlow(Network.ETH_MAINNET)
    val activeNetwork: StateFlow<Network> = _activeNetwork.asStateFlow()

    private val _isMetaMaskLocked = MutableStateFlow(true)
    val isMetaMaskLocked: StateFlow<Boolean> = _isMetaMaskLocked.asStateFlow()

    private val _isMetaMaskConnected = MutableStateFlow(false)
    val isMetaMaskConnected: StateFlow<Boolean> = _isMetaMaskConnected.asStateFlow()

    private val _simulationLogs = MutableStateFlow<List<LogEntry>>(emptyList())
    val simulationLogs: StateFlow<List<LogEntry>> = _simulationLogs.asStateFlow()

    private val _assets = MutableStateFlow<List<Asset>>(emptyList())
    val assets: StateFlow<List<Asset>> = _assets.asStateFlow()

    private val _activeDappRequest = MutableStateFlow<DappTransaction?>(null)
    val activeDappRequest: StateFlow<DappTransaction?> = _activeDappRequest.asStateFlow()

    private val _diagnosticsState = MutableStateFlow<List<DiagnosticItem>>(emptyList())
    val diagnosticsState: StateFlow<List<DiagnosticItem>> = _diagnosticsState.asStateFlow()

    private val _diagnosticsRunning = MutableStateFlow(false)
    val diagnosticsRunning: StateFlow<Boolean> = _diagnosticsRunning.asStateFlow()

    private val _diagnosticsProgress = MutableStateFlow(0f)
    val diagnosticsProgress: StateFlow<Float> = _diagnosticsProgress.asStateFlow()

    private val _gasPreference = MutableStateFlow(GasPreference.MARKET)
    val gasPreference: StateFlow<GasPreference> = _gasPreference.asStateFlow()

    private val _transactionHistory = MutableStateFlow<List<LogEntry>>(emptyList())
    val transactionHistory: StateFlow<List<LogEntry>> = _transactionHistory.asStateFlow()

    private val _auditLogs = MutableStateFlow<List<AuditEntry>>(emptyList())
    val auditLogs: StateFlow<List<AuditEntry>> = _auditLogs.asStateFlow()

    private val _adminUsers = MutableStateFlow<List<AdminUser>>(emptyList())
    val adminUsers: StateFlow<List<AdminUser>> = _adminUsers.asStateFlow()

    private val _isAuditComplianceSuccess = MutableStateFlow(true)
    val isAuditComplianceSuccess: StateFlow<Boolean> = _isAuditComplianceSuccess.asStateFlow()

    private val _lastAuditTimestamp = MutableStateFlow("")
    val lastAuditTimestamp: StateFlow<String> = _lastAuditTimestamp.asStateFlow()

    private val timeFormatter = SimpleDateFormat("HH:mm:ss", Locale.getDefault())

    init {
        // Hydrate initial mock metrics
        resetAssets()
        resetDiagnostics()
        initAdminState()
        addLog("SYSTEM", "MetaConnect engine initialized securely.")
        addLog("PROVIDER", "Decentralized node connections waiting listening.")
    }

    fun initAdminState() {
        val currentTime = timeFormatter.format(Date())
        _adminUsers.value = listOf(
            AdminUser(email = "jess.pirela@gmail.com", role = "Super Admin (Jesús Pirela - Full Access)", level = 4, lastActive = currentTime),
            AdminUser(email = "sentinel.node@metaconnect.io", role = "Compliance Auditor", level = 3, lastActive = currentTime),
            AdminUser(email = "dev.sandbox@ethereum-mesh.org", role = "Sandbox Node Dev", level = 2, lastActive = "03:02:18"),
            AdminUser(email = "anonymous.test_vector@web3.net", role = "Anonymous Tester", level = 1, isBlocked = false, lastActive = "02:44:11")
        )

        // Historical action seeding
        _auditLogs.value = listOf(
            AuditEntry(timestamp = "03:00:15", author = "Super Admin", action = "LOGIN", details = "Authenticated securely via Web3 control portal.", severity = "INFO"),
            AuditEntry(timestamp = "03:00:45", author = "System", action = "KEYRING_MOUNT", details = "Decryption keys successfully mounted in sandbox terminal.", severity = "INFO"),
            AuditEntry(timestamp = "03:01:20", author = "System", action = "RPC_INIT", details = "P2P nodes for Ethereum Mainnet initialized.", severity = "INFO"),
            AuditEntry(timestamp = "03:02:05", author = "Sentinel Node", action = "AUDIT_SCAN", details = "Automatic background audit: 100% compliant RPC gateway verified.", severity = "INFO")
        )
        
        _lastAuditTimestamp.value = "03:02:05"
    }

    fun addAuditEntry(author: String, action: String, details: String, severity: String = "INFO") {
        val timeStr = timeFormatter.format(Date())
        val entry = AuditEntry(timestamp = timeStr, author = author, action = action, details = details, severity = severity)
        _auditLogs.update { listOf(entry) + it }
    }

    fun toggleBlockUser(email: String) {
        _adminUsers.update { list ->
            list.map { user ->
                if (user.email == email) {
                    val newState = !user.isBlocked
                    addAuditEntry("Super Admin", if (newState) "BLOCK_USER" else "UNBLOCK_USER", "Modified policy state for: ${user.email} (Blocked: $newState)", "WARN")
                    user.copy(isBlocked = newState)
                } else user
            }
        }
    }

    fun addUser(email: String, role: String) {
        if (email.isBlank()) return
        val timeStr = timeFormatter.format(Date())
        val newUser = AdminUser(email = email, role = role, level = if (role.contains("Admin")) 4 else 2, lastActive = timeStr)
        _adminUsers.update { it + newUser }
        addAuditEntry("Super Admin", "CREATE_USER", "Registered new simulated profile: $email as $role", "INFO")
    }

    fun triggerSuperAudit() {
        val timeStr = timeFormatter.format(Date())
        _lastAuditTimestamp.value = timeStr
        val isCompliant = _diagnosticsState.value.none { it.status == DiagnosticStatus.ERROR }
        _isAuditComplianceSuccess.value = isCompliant
        addAuditEntry(
            author = "System Auditor",
            action = "COMPLIANCE_RUN",
            details = if (isCompliant) "All system indicators within nominal crypto thresholds. 100% compliant." 
                      else "Non-compliant node check discovered. Injected environment warnings must be resolved.",
            severity = if (isCompliant) "INFO" else "WARN"
        )
    }

    fun selectTab(tab: AppTab) {
        _selectedTab.value = tab
        addAuditEntry("Super Admin", "TAB_NAVIGATION", "Selected workspace section: ${tab.name}")
    }

    fun setNetwork(network: Network) {
        _activeNetwork.value = network
        addLog("RPC", "Switched connection network to ${network.displayName}")
        addAuditEntry("Super Admin", "NETWORK_SWITCH", "Switched gateway RPC channel to ${network.displayName}", "INFO")
        adjustAssetsOnNetworkChange(network)
    }

    fun changeAddress() {
        val randomHex = List(40) { "0123456789abcdef".random() }.joinToString("")
        val newAddr = "0x$randomHex"
        _walletAddress.value = newAddr
        addLog("KEYRING", "Account derived and loaded: $newAddr")
        addAuditEntry("Super Admin", "KEYRING_REGEN", "Regenerated dynamic private key. Derived address: $newAddr", "WARN")
    }

    fun triggerMetaMaskLockToggle() {
        val newState = !_isMetaMaskLocked.value
        _isMetaMaskLocked.value = newState
        val act = if (newState) "VAULT_LOCK" else "VAULT_UNLOCK"
        if (newState) {
            _isMetaMaskConnected.value = false
            addLog("KEYRING", "MetaMask locked securely. Session disconnected.")
            addAuditEntry("Active User", act, "MetaMask locked securely. Sandbox session terminated.", "INFO")
        } else {
            addLog("KEYRING", "MetaMask unlocked matching biometric credentials.")
            addAuditEntry("Active User", act, "MetaMask unlocked matching biometric credentials.", "INFO")
        }
        updateDiagnosticsStatus()
    }

    fun setGasPreference(preference: GasPreference) {
        _gasPreference.value = preference
    }

    fun addLog(type: String, message: String) {
        val timeStr = timeFormatter.format(Date())
        val newLog = LogEntry(time = timeStr, type = type, message = message)
        _simulationLogs.update { listOf(newLog) + it }
    }

    fun clearLogs() {
        _simulationLogs.value = emptyList()
        addLog("SYSTEM", "Simulation terminal logs cleared.")
    }

    private fun resetAssets() {
        _assets.value = listOf(
            Asset("Ethereum", "ETH", 1.842, 3424.50, listOf(3405f, 3415f, 3390f, 3432f, 3418f, 3422f, 3424.50f)),
            Asset("Web3 Token Sandbox", "SAND", 4500.0, 1.22, listOf(1.10f, 1.15f, 1.25f, 1.21f, 1.18f, 1.23f, 1.22f)),
            Asset("Chainlink", "LINK", 85.0, 18.30, listOf(17.80f, 17.95f, 18.50f, 18.15f, 18.00f, 18.42f, 18.30f)),
            Asset("USD Coin", "USDC", 1250.0, 1.00, listOf(1.0f, 1.0f, 1.0f, 1.0f, 1.0f, 1.0f, 1.0f))
        )
    }

    private fun adjustAssetsOnNetworkChange(network: Network) {
        when(network) {
            Network.ETH_MAINNET -> resetAssets()
            Network.ARBITRUM -> {
                _assets.value = listOf(
                    Asset("Arbitrum Ethereum", "ETH", 4.120, 3415.10, listOf(3380f, 3392f, 3440f, 3402f, 3415.10f)),
                    Asset("GMX Perpetuals", "GMX", 12.4, 45.22, listOf(43.10f, 44.05f, 45.22f)),
                    Asset("USD Coin", "USDC", 420.0, 1.00, listOf(1.0f, 1.0f))
                )
            }
            Network.POLYGON -> {
                _assets.value = listOf(
                    Asset("Polygon Token", "POL", 1680.0, 0.78, listOf(0.72f, 0.79f, 0.75f, 0.78f, 0.78f)),
                    Asset("Uniswap Staked", "UNI", 45.0, 7.82, listOf(7.60f, 7.90f, 7.82f))
                )
            }
            Network.BASE -> {
                _assets.value = listOf(
                    Asset("Base Ethereum", "ETH", 0.654, 3424.50, listOf(3402f, 3420f, 3424.50f)),
                    Asset("Aerodrome Token", "AERO", 2100.0, 0.84, listOf(0.78f, 0.81f, 0.86f, 0.84f))
                )
            }
            Network.SEPOLIA -> {
                _assets.value = listOf(
                    Asset("Sepolia sETH (Dummy)", "sETH", 28.51, 0.00, listOf(0f, 0f, 0f, 0f, 0f))
                )
            }
        }
    }

    fun triggerDappRequest(request: DappTransaction) {
        if (_isMetaMaskLocked.value) {
            addLog("ALERT", "DApp requested ${request.type.name} but MetaMask is LOCKED!")
        } else {
            addLog("DAPP", "Request received: ${request.dappName} - ${request.type.name}")
        }
        _activeDappRequest.value = request
    }

    fun handleMetaMaskUnlockAction() {
        _isMetaMaskLocked.value = false
        addLog("KEYRING", "MetaMask passcode correct. Sandbox vault verified decrypted.")
        updateDiagnosticsStatus()
    }

    fun approveDappRequest(request: DappTransaction, selectedGas: GasPreference) {
        val gasMultiplier = when(selectedGas) {
            GasPreference.ECO -> 0.8
            GasPreference.MARKET -> 1.0
            GasPreference.AGGRESSIVE -> 1.5
        }
        val estimatedGasEth = 0.0022 * gasMultiplier
        val randomTxHash = "0x" + List(64) { "0123456789abcdef".random() }.joinToString("")

        when(request.type) {
            TxType.CONNECT -> {
                _isMetaMaskConnected.value = true
                addLog("PROVIDER", "DApp approved: ${request.dappName} is connected using ${_walletAddress.value}")
                addAuditEntry("Active User", "DAPP_CONNECT", "Authorized connected linkage for ${request.dappName}", "INFO")
            }
            TxType.SIGN_MESSAGE -> {
                val mockSignature = "0x8fa3" + List(128) { "0123456789abcdef".random() }.joinToString("")
                addLog("SIGNATURE", "Message signed successfully. Sig: ${mockSignature.take(24)}...")
                addAuditEntry("Active User", "DAPP_SIGN", "Signed authorization string for ${request.dappName}", "INFO")
            }
            TxType.SEND_TRANSACTION -> {
                val updated = _assets.value.map { asset ->
                    if (asset.symbol == request.tokenSymbol && asset.balance >= request.tokenValue) {
                        asset.copy(balance = asset.balance - request.tokenValue)
                    } else if (asset.symbol == "ETH" && asset.balance >= estimatedGasEth) {
                        asset.copy(balance = asset.balance - estimatedGasEth)
                    } else {
                        asset
                    }
                }
                _assets.value = updated
                addLog("TRANSACTION", "Broadcasted transaction. Hash: ${randomTxHash.take(20)}...")
                addAuditEntry("Active User", "TRANSACTION", "Broadcasted transaction on ${activeNetwork.value.displayName} for ${request.tokenValue} ${request.tokenSymbol}. Fee profile: $selectedGas", "INFO")
                
                val timeStr = timeFormatter.format(Date())
                _transactionHistory.update { 
                    listOf(LogEntry(time = timeStr, type = "TX", message = "${request.dappName}: Send ${request.tokenValue} ${request.tokenSymbol}")) + it
                }
            }
        }
        _activeDappRequest.value = null
        updateDiagnosticsStatus()
    }

    fun rejectDappRequest() {
        _activeDappRequest.value?.let { tx ->
            addLog("DAPP", "User denied authorization signature for ${tx.dappName}.")
            addAuditEntry("Active User", "DAPP_REJECT", "User rejected cryptographic signature handshake for ${tx.dappName}.", "WARN")
        }
        _activeDappRequest.value = null
    }

    private fun resetDiagnostics() {
        _diagnosticsState.value = listOf(
            DiagnosticItem(
                id = "browser_injection",
                title = "1. RPC Provider Injection check",
                description = "Tests if 'window.ethereum' is successfully injected inside the current viewport header scope.",
                status = DiagnosticStatus.PENDING,
                recommendation = "Could not locate 'window.ethereum' script header. Ensure you use MetaMask's companion In-App Browser or check extension permissions inside desktop browsers.",
                fixActionName = "Simulate Injection"
            ),
            DiagnosticItem(
                id = "wallet_lock",
                title = "2. Companion Lock State",
                description = "Verifies if the vault db keychain is decrypted and listening.",
                status = DiagnosticStatus.PENDING,
                recommendation = "MetaMask dashboard is locked. Click 'Unlock Vault' below or enter password in popup to authorize wallet state reads.",
                fixActionName = "Unlock Vault"
            ),
            DiagnosticItem(
                id = "site_permission",
                title = "3. Domain Authorization",
                description = "Asserts if active site domain is authorized in MetaMask permissions registry.",
                status = DiagnosticStatus.PENDING,
                recommendation = "Domain not white-listed. Complete standard 'eth_requestAccounts' handshake connection to restore access.",
                fixActionName = "Connect Sandbox"
            ),
            DiagnosticItem(
                id = "node_ping",
                title = "4. RPC Provider Sync Node",
                description = "Pings native Ethereum nodes public gateway to verify latency diagnostics.",
                status = DiagnosticStatus.PENDING,
                recommendation = "Mainnet public node gateway has high latency or is rate-limited. Switch network or use private custom Infura keys."
            )
        )
    }

    fun runDiagnosticsSuit(scopeCoroutine: kotlinx.coroutines.CoroutineScope) {
        if (_diagnosticsRunning.value) return
        _diagnosticsRunning.value = true
        _diagnosticsProgress.value = 0f
        addAuditEntry("System", "DIAG_SCAN", "Initiated automated telemetry check sequence over RPC synching.", "INFO")
        
        scopeCoroutine.launch {
            resetDiagnostics()
            addLog("DIAGNOSTICS", "Initiating Web3 client connection verification...")
            
            delay(500)
            _diagnosticsProgress.value = 0.25f
            _diagnosticsState.update { list ->
                list.map { item ->
                    if (item.id == "browser_injection") {
                        item.copy(status = DiagnosticStatus.ERROR)
                    } else item
                }
            }
            addLog("DIAGNOSTICS", "ERR: Injected wallet adapter window.ethereum missing in DOM.")
            addAuditEntry("System", "DIAG_WARNING", "Browser injection check failed: window.ethereum is undefined.", "WARN")

            delay(500)
            _diagnosticsProgress.value = 0.50f
            updateDiagnosticsStatus()
            
            delay(500)
            _diagnosticsProgress.value = 0.75f
            updateDiagnosticsStatus()

            delay(500)
            _diagnosticsProgress.value = 1.0f
            _diagnosticsState.update { list ->
                list.map { item ->
                    if (item.id == "node_ping") {
                        item.copy(status = DiagnosticStatus.SUCCESS, recommendation = "Infura gateway responding in 48ms. Connection optimal.")
                    } else item
                }
            }
            addLog("DIAGNOSTICS", "Diagnostic analysis finished. Visual solutions generated below.")
            addAuditEntry("System", "DIAG_COMPLETE", "Finished full diagnostics telemetry check. Status evaluated.", "INFO")
            _diagnosticsRunning.value = false
        }
    }

    fun fixDiagnosticItem(itemId: String) {
        addAuditEntry("Super Admin", "DIAG_REMEDY", "Executed automated patch handshake for item: $itemId", "INFO")
        when(itemId) {
            "browser_injection" -> {
                _diagnosticsState.update { list ->
                    list.map { item ->
                        if (item.id == "browser_injection") {
                            item.copy(status = DiagnosticStatus.SUCCESS, recommendation = "window.ethereum adapter successfully simulated and injected inside Sandbox framework!")
                        } else item
                    }
                }
                addLog("DIAGNOSTICS", "Injected Simulated global window.ethereum successfully.")
            }
            "wallet_lock" -> {
                _isMetaMaskLocked.value = false
                updateDiagnosticsStatus()
                addLog("DIAGNOSTICS", "Companion unlocked matching local diagnostics.")
            }
            "site_permission" -> {
                if (_isMetaMaskLocked.value) {
                    addLog("DIAGNOSTICS", "Cannot authorize site while MetaMask companion is locked!")
                } else {
                    _isMetaMaskConnected.value = true
                    updateDiagnosticsStatus()
                    addLog("DIAGNOSTICS", "Sandbox white-listed and integrated securely.")
                }
            }
        }
    }

    private fun updateDiagnosticsStatus() {
        _diagnosticsState.update { list ->
            list.map { item ->
                when(item.id) {
                    "wallet_lock" -> {
                        if (!_isMetaMaskLocked.value) {
                            item.copy(status = DiagnosticStatus.SUCCESS, recommendation = "MetaMask extension unlocked. Nonce vault credentials decrypted.")
                        } else {
                            if (_diagnosticsProgress.value > 0.4f) {
                                item.copy(status = DiagnosticStatus.WARNING)
                            } else item
                        }
                    }
                    "site_permission" -> {
                        if (_isMetaMaskConnected.value) {
                            item.copy(status = DiagnosticStatus.SUCCESS, recommendation = "Active domain approved inside MetaMask site registry.")
                        } else {
                            if (_diagnosticsProgress.value > 0.6f) {
                                item.copy(status = DiagnosticStatus.ERROR)
                            } else item
                        }
                    }
                    else -> item
                }
            }
        }
    }

    fun triggerSimulatedTick() {
        val updated = _assets.value.map { asset ->
            if (asset.symbol == "USDC") return@map asset
            val changePercent = (Random.nextFloat() * 0.01f - 0.005f) // +/- 0.5%
            val newPrice = asset.priceUsd * (1 + changePercent)
            val newHistory = asset.priceHistory.drop(1) + newPrice.toFloat()
            asset.copy(priceUsd = newPrice, priceHistory = newHistory)
        }
        _assets.value = updated
    }
}

// ==========================================
// MAIN ACTIVITY
// ==========================================

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            MyApplicationTheme {
                Scaffold(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(Web3Obsidian),
                    contentWindowInsets = WindowInsets.safeDrawing
                ) { innerPadding ->
                    MetaConnectScreen(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(innerPadding)
                    )
                }
            }
        }
    }
}

// ==========================================
// CENTRAL COMPOSE VIEW
// ==========================================

@Composable
fun MetaConnectScreen(
    modifier: Modifier = Modifier,
    viewModel: Web3ViewModel = viewModel()
) {
    val selectedTab by viewModel.selectedTab.collectAsStateWithLifecycle()
    val walletAddress by viewModel.walletAddress.collectAsStateWithLifecycle()
    val activeNetwork by viewModel.activeNetwork.collectAsStateWithLifecycle()
    val isLocked by viewModel.isMetaMaskLocked.collectAsStateWithLifecycle()
    val isConnected by viewModel.isMetaMaskConnected.collectAsStateWithLifecycle()
    val activeDappRequest by viewModel.activeDappRequest.collectAsStateWithLifecycle()

    val clipboardManager = LocalClipboardManager.current
    val coroutineScope = rememberCoroutineScope()
    var clipboardToastVisible by remember { mutableStateOf(false) }

    LaunchedEffect(Unit) {
        while (true) {
            delay(4000)
            viewModel.triggerSimulatedTick()
        }
    }

    Box(
        modifier = modifier
            .fillMaxSize()
            .background(Web3Obsidian)
            .drawBehind {
                val r1 = size.width * 0.8f
                if (r1 > 0f) {
                    drawCircle(
                        brush = Brush.radialGradient(
                            colors = listOf(EthereumPurple.copy(alpha = 0.12f), Color.Transparent),
                            center = Offset(size.width * 0.1f, size.height * 0.2f),
                            radius = r1
                        )
                    )
                }
                val r2 = size.width * 0.9f
                if (r2 > 0f) {
                    drawCircle(
                        brush = Brush.radialGradient(
                            colors = listOf(Web3Cyan.copy(alpha = 0.08f), Color.Transparent),
                            center = Offset(size.width * 0.9f, size.height * 0.8f),
                            radius = r2
                        )
                    )
                }
            }
    ) {
        // Safe cryptographic invisible watermark signature tagging the layout tree
        Text(
            text = "creado por Jesús Pirela",
            color = Color.Transparent,
            modifier = Modifier
                .size(1.dp)
                .alpha(0.0f)
                .testTag("signature_jesus_pirela")
        )

        Column(
            modifier = Modifier.fillMaxSize()
        ) {
            Web3Header(
                walletAddress = walletAddress,
                network = activeNetwork,
                isLocked = isLocked,
                isConnected = isConnected,
                onCopyAddress = {
                    clipboardManager.setText(AnnotatedString(walletAddress))
                    coroutineScope.launch {
                        clipboardToastVisible = true
                        delay(2000)
                        clipboardToastVisible = false
                    }
                },
                onRegenerateAddress = { viewModel.changeAddress() },
                onSelectNetwork = { viewModel.setNetwork(it) }
            )

            AnimatedVisibility(
                visible = clipboardToastVisible,
                enter = fadeIn() + slideInVertically(),
                exit = fadeOut() + slideOutVertically()
            ) {
                Card(
                    colors = CardDefaults.cardColors(containerColor = Web3Mint),
                    shape = RoundedCornerShape(8.dp),
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp, vertical = 8.dp)
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(12.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.Center
                    ) {
                        Icon(
                            Icons.Default.ContentCopy,
                            contentDescription = "Copied",
                            tint = Web3Obsidian,
                            modifier = Modifier.size(16.dp)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "Derived Web3 Key Address copied successfully!",
                            color = Web3Obsidian,
                            fontWeight = FontWeight.Bold,
                            fontSize = 12.sp
                        )
                    }
                }
            }

            Web3TabRow(
                selectedTab = selectedTab,
                onTabSelected = { viewModel.selectTab(it) }
            )

            Box(
                modifier = Modifier
                    .weight(1f)
                    .fillMaxWidth()
            ) {
                Crossfade(targetState = selectedTab, label = "TabTransitions") { tab ->
                    when (tab) {
                        AppTab.DIAGNOSTICS -> DiagnosticTabScreen(viewModel = viewModel)
                        AppTab.PLAYGROUND -> PlaygroundTabScreen(viewModel = viewModel)
                        AppTab.PORTFOLIO -> PortfolioTabScreen(viewModel = viewModel)
                        AppTab.ADMIN -> AdminTabScreen(viewModel = viewModel)
                    }
                }
            }

            TerminalLogsPanel(viewModel = viewModel)
        }

        AnimatedVisibility(
            visible = activeDappRequest != null,
            enter = slideInVertically(
                initialOffsetY = { it },
                animationSpec = spring(dampingRatio = Spring.DampingRatioLowBouncy, stiffness = Spring.StiffnessMedium)
            ),
            exit = slideOutVertically(
                targetOffsetY = { it },
                animationSpec = tween(durationMillis = 300)
            ),
            modifier = Modifier.fillMaxSize()
        ) {
            activeDappRequest?.let { request ->
                MetaMaskEmulatorDialog(
                    request = request,
                    walletAddress = walletAddress,
                    network = activeNetwork,
                    isMetaMaskLocked = isLocked,
                    onApprove = { gas -> viewModel.approveDappRequest(request, gas) },
                    onReject = { viewModel.rejectDappRequest() },
                    onUnlockMetaMask = { viewModel.handleMetaMaskUnlockAction() }
                )
            }
        }
    }
}

// ==========================================
// SUB-COMPOSABLES & DESIGN DETAILS
// ==========================================

@Composable
fun Web3Header(
    walletAddress: String,
    network: Network,
    isLocked: Boolean,
    isConnected: Boolean,
    onCopyAddress: () -> Unit,
    onRegenerateAddress: () -> Unit,
    onSelectNetwork: (Network) -> Unit
) {
    var expandedDropdown by remember { mutableStateOf(false) }

    Surface(
        color = Web3SurfaceDark.copy(alpha = 0.85f),
        modifier = Modifier
            .fillMaxWidth()
            .drawBehind {
                drawLine(
                    color = DividerPurple,
                    start = Offset(0f, size.height),
                    end = Offset(size.width, size.height),
                    strokeWidth = 1.dp.toPx()
                )
            }
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Box(
                        modifier = Modifier
                            .size(36.dp)
                            .background(
                                Brush.linearGradient(listOf(EthereumPurple, Web3Cyan)),
                                shape = RoundedCornerShape(10.dp)
                            )
                            .padding(2.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Box(
                            modifier = Modifier
                                .fillMaxSize()
                                .background(Web3Obsidian, shape = RoundedCornerShape(8.dp)),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                "M",
                                color = Web3Mint,
                                fontWeight = FontWeight.Black,
                                fontSize = 18.sp,
                                fontFamily = FontFamily.Monospace
                            )
                        }
                    }

                    Spacer(modifier = Modifier.width(10.dp))

                    Column {
                        Text(
                            text = "MetaConnect",
                            fontSize = 15.sp,
                            fontWeight = FontWeight.Bold,
                            color = TextPrimary,
                            letterSpacing = 0.5.sp
                        )
                        Text(
                            text = "Web3 Sandbox Adapter",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Medium,
                            color = Web3Cyan
                        )
                    }
                }

                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier
                        .background(DividerPurple, RoundedCornerShape(12.dp))
                        .padding(horizontal = 10.dp, vertical = 6.dp)
                ) {
                    val statusColor = when {
                        isLocked -> Web3Amber
                        isConnected -> Web3Mint
                        else -> TextMuted
                    }
                    val statusLabel = when {
                        isLocked -> "LOCKED"
                        isConnected -> "CONNECTED"
                        else -> "STANDBY"
                    }

                    Box(
                        modifier = Modifier
                            .size(7.dp)
                            .background(statusColor, CircleShape)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = statusLabel,
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Black,
                        color = statusColor
                    )
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier
                        .weight(1.3f)
                        .background(Web3Obsidian, RoundedCornerShape(8.dp))
                        .border(1.dp, CardBorder, RoundedCornerShape(8.dp))
                        .clickable(onClick = onCopyAddress)
                        .padding(horizontal = 8.dp, vertical = 8.dp)
                ) {
                    Icon(
                        Icons.Outlined.AccountBalanceWallet,
                        contentDescription = "Wallet",
                        tint = EthereumPurple,
                        modifier = Modifier.size(16.dp)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = "${walletAddress.take(6)}...${walletAddress.takeLast(4)}",
                        fontSize = 11.sp,
                        fontFamily = FontFamily.Monospace,
                        color = TextPrimary,
                        modifier = Modifier.weight(1f)
                    )
                    Icon(
                        Icons.Default.ContentCopy,
                        contentDescription = "Copy Address",
                        tint = TextSecondary,
                        modifier = Modifier
                            .size(12.dp)
                            .testTag("copy_address_btn")
                    )
                }

                Spacer(modifier = Modifier.width(8.dp))

                IconButton(
                    onClick = onRegenerateAddress,
                    modifier = Modifier
                        .background(Web3Obsidian, RoundedCornerShape(8.dp))
                        .border(1.dp, CardBorder, RoundedCornerShape(8.dp))
                        .size(34.dp)
                        .testTag("regenerate_key_btn")
                ) {
                    Icon(
                        Icons.Default.Refresh,
                        contentDescription = "Regenerate Web3 Account",
                        tint = Web3Mint,
                        modifier = Modifier.size(16.dp)
                    )
                }

                Spacer(modifier = Modifier.width(8.dp))

                Box(
                    modifier = Modifier.weight(1.1f)
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(34.dp)
                            .background(network.color.copy(alpha = 0.15f), RoundedCornerShape(8.dp))
                            .border(1.dp, network.color.copy(alpha = 0.4f), RoundedCornerShape(8.dp))
                            .clickable { expandedDropdown = true }
                            .padding(horizontal = 8.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Box(modifier = Modifier.size(6.dp).background(network.color, CircleShape))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = network.displayName.split(" ").first(),
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = TextPrimary,
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis
                        )
                        Icon(
                            Icons.Default.ArrowDropDown,
                            contentDescription = "Networks Dropdown",
                            tint = TextSecondary,
                            modifier = Modifier.size(14.dp)
                        )
                    }

                    DropdownMenu(
                        expanded = expandedDropdown,
                        onDismissRequest = { expandedDropdown = false },
                        modifier = Modifier
                            .background(Web3SurfaceCard)
                            .border(1.dp, CardBorder, RoundedCornerShape(4.dp))
                    ) {
                        Network.values().forEach { net ->
                            DropdownMenuItem(
                                text = {
                                    Row(verticalAlignment = Alignment.CenterVertically) {
                                        Box(
                                            modifier = Modifier
                                                .size(8.dp)
                                                .background(net.color, CircleShape)
                                        )
                                        Spacer(modifier = Modifier.width(8.dp))
                                        Text(net.displayName, color = TextPrimary, fontSize = 12.sp)
                                    }
                                },
                                onClick = {
                                    onSelectNetwork(net)
                                    expandedDropdown = false
                                }
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun Web3TabRow(
    selectedTab: AppTab,
    onTabSelected: (AppTab) -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .background(Web3Obsidian)
            .padding(horizontal = 16.dp, vertical = 12.dp),
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        AppTab.values().forEach { tab ->
            val isActive = selectedTab == tab
            val tabColor = if (isActive) Web3Mint else TextMuted
            val backgroundFill = if (isActive) DividerPurple else Color.Transparent
            val borderDraw = if (isActive) CardBorder else Color.Transparent

            Row(
                modifier = Modifier
                    .weight(1f)
                    .padding(horizontal = 4.dp)
                    .background(backgroundFill, RoundedCornerShape(10.dp))
                    .border(1.dp, borderDraw, RoundedCornerShape(10.dp))
                    .clickable { onTabSelected(tab) }
                    .padding(vertical = 10.dp, horizontal = 4.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.Center
            ) {
                val icon = when(tab) {
                    AppTab.DIAGNOSTICS -> Icons.Default.NetworkCheck
                    AppTab.PLAYGROUND -> Icons.Default.Dashboard
                    AppTab.PORTFOLIO -> Icons.Default.CurrencyExchange
                    AppTab.ADMIN -> Icons.Default.Security
                }
                Icon(
                    icon,
                    contentDescription = tab.name,
                    tint = tabColor,
                    modifier = Modifier.size(15.dp)
                )
                Spacer(modifier = Modifier.width(6.dp))
                Text(
                    text = when(tab) {
                        AppTab.DIAGNOSTICS -> "Fix Errors"
                        AppTab.PLAYGROUND -> "Dapp Sandbox"
                        AppTab.PORTFOLIO -> "Portfolio"
                        AppTab.ADMIN -> "Super Admin"
                    },
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    color = tabColor,
                    maxLines = 1
                )
            }
        }
    }
}

// ==========================================
// TAB 1: DIAGNOSTIC SUITE
// ==========================================

@Composable
fun DiagnosticTabScreen(
    viewModel: Web3ViewModel
) {
    val items by viewModel.diagnosticsState.collectAsStateWithLifecycle()
    val isRunning by viewModel.diagnosticsRunning.collectAsStateWithLifecycle()
    val progress by viewModel.diagnosticsProgress.collectAsStateWithLifecycle()

    val coroutineScope = rememberCoroutineScope()

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = Web3Pink.copy(alpha = 0.12f)),
                shape = RoundedCornerShape(16.dp),
                border = BorderStroke(1.dp, Web3Pink.copy(alpha = 0.35f)),
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = 4.dp)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                             Icons.Default.Terminal,
                             contentDescription = "Target Error",
                             tint = Web3Pink,
                             modifier = Modifier.size(18.dp)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                             "CRITICAL TARGET WEB3 RUNTIME ERROR",
                             fontSize = 10.sp,
                             fontWeight = FontWeight.Black,
                             color = Web3Pink,
                             letterSpacing = 1.sp
                        )
                    }

                    Spacer(modifier = Modifier.height(10.dp))

                    Text(
                        text = "Unhandled Runtime Error: i: Failed to connect to MetaMask",
                        fontFamily = FontFamily.Monospace,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = Web3Pink
                    )
                    Text(
                        text = "at Object.connect (chrome-extension://.../inpage.js:1:63510)",
                        fontFamily = FontFamily.Monospace,
                        fontSize = 10.sp,
                        color = TextMuted,
                        modifier = Modifier.padding(top = 2.dp)
                    )

                    Spacer(modifier = Modifier.height(12.dp))
                    HorizontalDivider(color = DividerPurple)
                    Spacer(modifier = Modifier.height(10.dp))

                    Text(
                        text = "When decentralized applications cannot communicate with browser wallet extension hooks, connections fail immediately. Use the diagnostics engine below to isolate and fix script adapter locks recursively.",
                        fontSize = 11.sp,
                        color = TextSecondary,
                        lineHeight = 16.sp
                    )

                    Spacer(modifier = Modifier.height(14.dp))

                    Button(
                        onClick = { viewModel.runDiagnosticsSuit(coroutineScope) },
                        colors = ButtonDefaults.buttonColors(
                            containerColor = if (isRunning) Web3SurfaceDark else Web3Mint,
                            contentColor = Web3Obsidian
                        ),
                        shape = RoundedCornerShape(8.dp),
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(44.dp)
                            .testTag("run_diagnostics_btn"),
                        enabled = !isRunning
                    ) {
                        if (isRunning) {
                            CircularProgressIndicator(
                                modifier = Modifier.size(18.dp),
                                color = Web3Mint,
                                strokeWidth = 2.dp
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Text("Scanning RPC Adapter Node...", color = Web3Mint, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                        } else {
                            Icon(Icons.Default.PlayArrow, contentDescription = null, tint = Web3Obsidian, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text("RUN AUTOMATED Web3 ANALYZER", color = Web3Obsidian, fontSize = 12.sp, fontWeight = FontWeight.Black)
                        }
                    }

                    if (isRunning || progress > 0f) {
                        Spacer(modifier = Modifier.height(12.dp))
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.SpaceBetween,
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Text("Scanner progress", fontSize = 10.sp, color = TextMuted)
                            Text("${(progress * 100).toInt()}%", fontSize = 10.sp, color = Web3Cyan, fontWeight = FontWeight.Bold)
                        }
                        Spacer(modifier = Modifier.height(4.dp))
                        LinearProgressIndicator(
                            progress = { progress },
                            color = Web3Cyan,
                            trackColor = Web3SurfaceDark,
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(4.dp)
                                .clip(RoundedCornerShape(2.dp))
                        )
                    }
                }
            }
        }

        if (items.isEmpty()) {
            item {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 32.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Icon(
                        Icons.Default.GridGoldenratio,
                        contentDescription = "Pending Run",
                        tint = TextMuted,
                        modifier = Modifier.size(48.dp)
                    )
                    Spacer(modifier = Modifier.height(12.dp))
                    Text(
                        "Diagnostics Standby Pending Scan",
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Bold,
                        color = TextSecondary
                    )
                    Text(
                        "Click 'RUN AUTOMATED Web3 ANALYZER' to pinpoint connection issues.",
                        fontSize = 11.sp,
                        color = TextMuted,
                        textAlign = TextAlign.Center,
                        modifier = Modifier
                            .padding(horizontal = 24.dp)
                            .padding(top = 4.dp)
                    )
                }
            }
        } else {
            items(items) { item ->
                DiagnosticItemCard(
                    item = item,
                    onResumeFix = { viewModel.fixDiagnosticItem(item.id) }
                )
            }

            item {
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = "WEB3 ERROR KNOWLEDGE BASE",
                    fontSize = 10.sp,
                    fontWeight = FontWeight.Black,
                    color = Web3Cyan,
                    letterSpacing = 1.sp,
                    modifier = Modifier.padding(bottom = 8.dp)
                )
            }

            item {
                TroubleGuideCard(
                    issue = "Conflict with multiple browser web3 wallet extensions",
                    fix = "Whenever MetaMask, Phantom, or Coinbase Wallet extensions are active simultaneously, they contest the global 'window.ethereum' injection pipeline.\n\nFix: Open MetaMask > Settings > Advanced, and ensure 'Set as default wallet' is toggle enabled, or disable other wallet extensions temporarily in browser settings."
                )
            }

            item {
                TroubleGuideCard(
                    issue = "Nonce Sync Reset & stuck outbound transactions",
                    fix = "When transactions nonce gets misaligned between local chrome client cache and the blockchain node RPC, MetaMask pauses all upcoming signatures.\n\nFix: Navigate to MetaMask > Advanced > Clear Activity Tab Data. This resets local nonce tracking safely without altering token key assets."
                )
            }

            item {
                TroubleGuideCard(
                    issue = "Mobile MetaMask Deep Link Handshake integration",
                    fix = "On mobile browsers, standard JavaScript injection fails. Apps must initiate dApp connections using custom deep linking URLs (e.g. metamask://dapp/yoururl.com).\n\nUse the Sandbox Simulation tab below to experience standard RPC communication logs."
                )
            }
        }

        item {
            Spacer(modifier = Modifier.height(24.dp))
        }
    }
}

@Composable
fun DiagnosticItemCard(
    item: DiagnosticItem,
    onResumeFix: () -> Unit
) {
    val statusColor = when (item.status) {
        DiagnosticStatus.SUCCESS -> Web3Mint
        DiagnosticStatus.WARNING -> Web3Amber
        DiagnosticStatus.ERROR -> Web3Pink
        DiagnosticStatus.PENDING -> TextMuted
    }
    
    val statusIcon = when (item.status) {
        DiagnosticStatus.SUCCESS -> Icons.Default.CheckCircle
        DiagnosticStatus.WARNING -> Icons.Default.Warning
        DiagnosticStatus.ERROR -> Icons.Default.Error
        DiagnosticStatus.PENDING -> Icons.Default.Circle
    }

    Card(
        colors = CardDefaults.cardColors(containerColor = Web3SurfaceCard),
        border = BorderStroke(1.dp, if (item.status == DiagnosticStatus.ERROR) Web3Pink.copy(alpha = 0.5f) else CardBorder),
        shape = RoundedCornerShape(12.dp)
    ) {
        Column(modifier = Modifier.padding(14.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.Top,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Row(
                    modifier = Modifier.weight(1f),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        statusIcon,
                        contentDescription = item.status.name,
                        tint = statusColor,
                        modifier = Modifier.size(16.dp)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = item.title,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        color = TextPrimary
                    )
                }

                Text(
                    text = item.status.name,
                    fontSize = 9.sp,
                    fontWeight = FontWeight.Black,
                    color = statusColor,
                    modifier = Modifier
                        .background(statusColor.copy(alpha = 0.15f), RoundedCornerShape(6.dp))
                        .padding(horizontal = 6.dp, vertical = 2.dp)
                )
            }

            Spacer(modifier = Modifier.height(6.dp))
            Text(text = item.description, fontSize = 11.sp, color = TextSecondary)

            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = "⚡ ADVICE: ${item.recommendation}",
                fontSize = 11.sp,
                fontWeight = FontWeight.Medium,
                color = if (item.status == DiagnosticStatus.ERROR) Web3Pink else TextSecondary,
                lineHeight = 15.sp,
                modifier = Modifier
                    .background(Web3Obsidian, RoundedCornerShape(6.dp))
                    .padding(8.dp)
                    .fillMaxWidth()
            )

            if (item.status != DiagnosticStatus.SUCCESS && item.fixActionName != null) {
                Spacer(modifier = Modifier.height(10.dp))
                Button(
                    onClick = onResumeFix,
                    colors = ButtonDefaults.buttonColors(
                        containerColor = DividerPurple,
                        contentColor = Web3Mint
                    ),
                    shape = RoundedCornerShape(6.dp),
                    contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp),
                    modifier = Modifier
                        .height(30.dp)
                        .testTag("fix_${item.id}_btn")
                ) {
                    Text(text = "Execute: ${item.fixActionName}", fontSize = 10.sp, fontWeight = FontWeight.Bold)
                    Spacer(modifier = Modifier.width(4.dp))
                    Icon(Icons.Default.FlashOn, contentDescription = null, tint = Web3Mint, modifier = Modifier.size(10.dp))
                }
            }
        }
    }
}

@Composable
fun TroubleGuideCard(
    issue: String,
    fix: String
) {
    var expanded by remember { mutableStateOf(false) }

    Card(
        colors = CardDefaults.cardColors(containerColor = Web3SurfaceCard.copy(alpha = 0.6f)),
        shape = RoundedCornerShape(8.dp),
        border = BorderStroke(1.dp, DividerPurple),
        modifier = Modifier
            .fillMaxWidth()
            .clickable { expanded = !expanded }
    ) {
        Column(modifier = Modifier.padding(12.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(
                    text = issue,
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    color = TextPrimary,
                    modifier = Modifier.weight(1f)
                )
                Icon(
                    imageVector = if (expanded) Icons.Default.ExpandLess else Icons.Default.ExpandMore,
                    contentDescription = "Expand Guide",
                    tint = TextSecondary,
                    modifier = Modifier.size(16.dp)
                )
            }
            if (expanded) {
                Spacer(modifier = Modifier.height(8.dp))
                HorizontalDivider(color = DividerPurple)
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = fix,
                    fontSize = 11.sp,
                    color = TextSecondary,
                    lineHeight = 16.sp,
                    fontFamily = FontFamily.SansSerif
                )
            }
        }
    }
}

// ==========================================
// TAB 2: INTERACTIVE DAPP SANDBOX
// ==========================================

@Composable
fun PlaygroundTabScreen(
    viewModel: Web3ViewModel
) {
    val isLocked by viewModel.isMetaMaskLocked.collectAsStateWithLifecycle()
    val isConnected by viewModel.isMetaMaskConnected.collectAsStateWithLifecycle()
    val rawAddress by viewModel.walletAddress.collectAsStateWithLifecycle()

    var swapAmountEth by remember { mutableStateOf("1.50") }
    var mintedId by remember { mutableStateOf(1) }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = Web3SurfaceDark),
                shape = RoundedCornerShape(8.dp),
                border = BorderStroke(1.dp, CardBorder)
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(12.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Box(
                        modifier = Modifier
                            .background(if (isLocked) Web3Amber.copy(0.15f) else Web3Mint.copy(0.15f), CircleShape)
                            .padding(8.dp)
                    ) {
                        Icon(
                            imageVector = if (isLocked) Icons.Default.Lock else Icons.Default.LockOpen,
                            contentDescription = null,
                            tint = if (isLocked) Web3Amber else Web3Mint,
                            modifier = Modifier.size(16.dp)
                        )
                    }

                    Spacer(modifier = Modifier.width(12.dp))

                    Column {
                        Text(
                            text = if (isLocked) "Companion Locked in Sandbox" else "Companion Decrypted Ready",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            color = TextPrimary
                        )
                        Text(
                            text = if (isLocked) "Unlock MetaMask companion above or tap 'Unlock Vault' diagnostics." else "Test injecting standard signature handshakes dynamically below.",
                            fontSize = 11.sp,
                            color = TextSecondary
                        )
                    }
                }
            }
        }

        item {
            Text(
                "MOCK WEB3 SANDBOX INTEGRATED DAPPS",
                fontSize = 10.sp,
                fontWeight = FontWeight.Black,
                color = Web3Cyan,
                letterSpacing = 1.sp
            )
        }

        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = Web3SurfaceCard),
                shape = RoundedCornerShape(12.dp),
                border = BorderStroke(1.dp, CardBorder)
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Box(
                                modifier = Modifier
                                    .size(24.dp)
                                    .background(Web3Pink.copy(alpha = 0.15f), CircleShape)
                                    .padding(4.dp),
                                contentAlignment = Alignment.Center
                            ) {
                                Text("🦄", fontSize = 12.sp)
                            }
                            Spacer(modifier = Modifier.width(8.dp))
                            Column {
                                Text("Uniswap V3 Swap", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = TextPrimary)
                                Text("https://app.uniswap.org", fontSize = 9.sp, color = TextMuted)
                            }
                        }

                        Text(
                            text = if (isConnected) "Detected" else "No Connection",
                            fontSize = 9.sp,
                            fontWeight = FontWeight.Bold,
                            color = if (isConnected) Web3Mint else Web3Amber,
                            modifier = Modifier
                                .background(if (isConnected) Web3Mint.copy(alpha = 0.1f) else Web3Amber.copy(alpha = 0.1f), RoundedCornerShape(4.dp))
                                .padding(horizontal = 6.dp, vertical = 2.dp)
                        )
                    }

                    Spacer(modifier = Modifier.height(14.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        OutlinedTextField(
                            value = swapAmountEth,
                            onValueChange = { swapAmountEth = it },
                            label = { Text("You Pay (ETH)", fontSize = 10.sp) },
                            singleLine = true,
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedTextColor = TextPrimary,
                                unfocusedTextColor = TextPrimary,
                                focusedBorderColor = Web3Cyan,
                                unfocusedBorderColor = DividerPurple,
                                focusedLabelColor = Web3Cyan,
                                unfocusedLabelColor = TextSecondary
                            ),
                            modifier = Modifier
                                .weight(1f)
                                .height(50.dp)
                        )

                        Spacer(modifier = Modifier.width(12.dp))
                        Icon(Icons.Default.ArrowForward, contentDescription = null, tint = TextMuted)
                        Spacer(modifier = Modifier.width(12.dp))

                        val outAmount = (swapAmountEth.toDoubleOrNull() ?: 0.0) * 3424.50
                        Column(
                            modifier = Modifier
                                .weight(1f)
                                .height(50.dp)
                                .background(Web3Obsidian, RoundedCornerShape(4.dp))
                                .border(1.dp, DividerPurple, RoundedCornerShape(4.dp))
                                .padding(horizontal = 8.dp, vertical = 6.dp),
                            verticalArrangement = Arrangement.Center
                        ) {
                            Text("You Receive", fontSize = 9.sp, color = TextSecondary)
                            Text(
                                String.format("%.2f USDC", outAmount),
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = Web3Mint,
                                maxLines = 1
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(14.dp))

                    if (!isConnected) {
                        Button(
                            onClick = {
                                viewModel.triggerDappRequest(
                                    DappTransaction(
                                        dappName = "Uniswap Session",
                                        dappUrl = "https://app.uniswap.org",
                                        type = TxType.CONNECT,
                                        description = "Approve connection sandbox adapter permission request.",
                                        tokenSymbol = "ETH",
                                        tokenValue = 0.0,
                                        usdValue = 0.0,
                                        payloadHex = "0x"
                                    )
                                )
                            },
                            colors = ButtonDefaults.buttonColors(containerColor = Web3Pink),
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(38.dp)
                                .testTag("uniswap_connect_wallet"),
                            shape = RoundedCornerShape(6.dp)
                        ) {
                            Text("Connect MetaMask Wallet Adapter", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Color.White)
                        }
                    } else {
                        Button(
                            onClick = {
                                val txVal = swapAmountEth.toDoubleOrNull() ?: 1.0
                                viewModel.triggerDappRequest(
                                    DappTransaction(
                                        dappName = "Uniswap Protocol",
                                        dappUrl = "https://app.uniswap.org",
                                        type = TxType.SEND_TRANSACTION,
                                        description = "Exchanging $txVal ETH for ${String.format("%.2f", txVal * 3424.50)} USDC assets.",
                                        tokenSymbol = "ETH",
                                        tokenValue = txVal,
                                        usdValue = txVal * 3424.50,
                                        payloadHex = "0xa9059cbb000000000000000000000000${rawAddress.substring(2)}"
                                    )
                                )
                            },
                            colors = ButtonDefaults.buttonColors(containerColor = Web3Mint),
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(38.dp)
                                .testTag("uniswap_swap_btn"),
                            shape = RoundedCornerShape(6.dp)
                        ) {
                            Text("Simulate Exchanging Swap Route", fontSize = 11.sp, fontWeight = FontWeight.Black, color = Web3Obsidian)
                        }
                    }
                }
            }
        }

        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = Web3SurfaceCard),
                shape = RoundedCornerShape(12.dp),
                border = BorderStroke(1.dp, CardBorder)
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Box(
                                modifier = Modifier
                                    .size(24.dp)
                                    .background(Web3Cyan.copy(alpha = 0.15f), CircleShape)
                                    .padding(4.dp),
                                contentAlignment = Alignment.Center
                            ) {
                                Text("⛵", fontSize = 12.sp)
                            }
                            Spacer(modifier = Modifier.width(8.dp))
                            Column {
                                Text("OpenSea NFT Mint Station", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = TextPrimary)
                                Text("https://opensea.io/mint", fontSize = 9.sp, color = TextMuted)
                            }
                        }

                        Text(
                            text = "ERC-721",
                            fontSize = 8.sp,
                            color = Web3Cyan,
                            fontWeight = FontWeight.Black,
                            modifier = Modifier
                                .background(Web3Cyan.copy(alpha = 0.1f), RoundedCornerShape(4.dp))
                                .padding(horizontal = 5.dp, vertical = 2.dp)
                        )
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(Web3Obsidian, RoundedCornerShape(8.dp))
                            .border(1.dp, DividerPurple, RoundedCornerShape(8.dp))
                            .padding(8.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Box(
                            modifier = Modifier
                                .size(50.dp)
                                .background(
                                    Brush.sweepGradient(listOf(Web3Pink, Web3Cyan, Web3Amber)),
                                    RoundedCornerShape(6.dp)
                                ),
                            contentAlignment = Alignment.Center
                        ) {
                            Text("👾", fontSize = 24.sp)
                        }

                        Spacer(modifier = Modifier.width(12.dp))

                        Column(modifier = Modifier.weight(1f)) {
                            Text("AstroPunk Cyber NFT #42${mintedId}", fontWeight = FontWeight.Bold, fontSize = 12.sp, color = TextPrimary)
                            Text("Direct smart contract collection mint", fontSize = 10.sp, color = TextSecondary)
                            Text("Flat Price: 0.05 ETH (~$171.20 USD)", fontSize = 10.sp, color = Web3Mint, fontWeight = FontWeight.SemiBold)
                        }
                    }

                    Spacer(modifier = Modifier.height(14.dp))

                    Button(
                        onClick = {
                            viewModel.triggerDappRequest(
                                DappTransaction(
                                    dappName = "OpenSea Launchpad",
                                    dappUrl = "https://opensea.io/mint",
                                    type = TxType.SEND_TRANSACTION,
                                    description = "Direct minting of digital artifact 'AstroPunk Cyber NFT #42$mintedId' from ERC-721 Contract.",
                                    tokenSymbol = "ETH",
                                    tokenValue = 0.05,
                                    usdValue = 171.20,
                                    payloadHex = "0x1249c5e3000000000000000000000000000000000000000000000000000000000000a45b"
                                )
                            )
                            mintedId++
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = Web3Cyan),
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(38.dp)
                            .testTag("opensea_mint_btn"),
                        shape = RoundedCornerShape(6.dp)
                    ) {
                        Text("Simulate Mint Digital Object (0.05 ETH)", fontSize = 11.sp, fontWeight = FontWeight.Black, color = Web3Obsidian)
                    }
                }
            }
        }

        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = Web3SurfaceCard),
                shape = RoundedCornerShape(12.dp),
                border = BorderStroke(1.dp, CardBorder)
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Box(
                            modifier = Modifier
                                .size(24.dp)
                                .background(Web3Amber.copy(alpha = 0.15f), CircleShape)
                                .padding(4.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(Icons.Default.VerifiedUser, contentDescription = null, tint = Web3Amber, modifier = Modifier.size(14.dp))
                        }
                        Spacer(modifier = Modifier.width(8.dp))
                        Column {
                            Text("Web3 Secure Login Gate", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = TextPrimary)
                            Text("https://security-mesh.eth", fontSize = 9.sp, color = TextMuted)
                        }
                    }

                    Spacer(modifier = Modifier.height(10.dp))
                    Text(
                        text = "Performs cryptographic verification without gas fees using standard personal_sign keys.",
                        fontSize = 11.sp,
                        color = TextSecondary
                    )

                    Spacer(modifier = Modifier.height(14.dp))

                    Button(
                        onClick = {
                            viewModel.triggerDappRequest(
                                DappTransaction(
                                    dappName = "Security Mesh Login",
                                    dappUrl = "https://security-mesh.eth",
                                    type = TxType.SIGN_MESSAGE,
                                    description = "Sign this challenge statement to authorize decentralized identification and session decrypt:\n\nChallenge-Nonce: 48f9-b3a1\nTimestamp: 2026-06-01T23:44\nDomain: security-mesh.eth",
                                    tokenSymbol = "ETH",
                                    tokenValue = 0.0,
                                    usdValue = 0.0,
                                    payloadHex = "0x53656375726974794d65736820566572696669636174696f6e"
                                )
                            )
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = Web3Amber),
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(38.dp)
                            .testTag("auth_login_sign_btn"),
                        shape = RoundedCornerShape(6.dp)
                    ) {
                        Text("Simulate 'personal_sign' Login Handshake", fontSize = 11.sp, fontWeight = FontWeight.Black, color = Web3Obsidian)
                    }
                }
            }
        }

        item {
            Spacer(modifier = Modifier.height(24.dp))
        }
    }
}

// ==========================================
// TAB 3: PORTFOLIO & HISTORIC HOLDINGS
// ==========================================

@Composable
fun PortfolioTabScreen(
    viewModel: Web3ViewModel
) {
    val assets by viewModel.assets.collectAsStateWithLifecycle()
    val activeNetwork by viewModel.activeNetwork.collectAsStateWithLifecycle()
    val transactionHistory by viewModel.transactionHistory.collectAsStateWithLifecycle()

    val totalBalanceValue = assets.sumOf { it.balance * it.priceUsd }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = Web3SurfaceCard),
                shape = RoundedCornerShape(12.dp),
                border = BorderStroke(1.dp, CardBorder),
                modifier = Modifier.padding(top = 4.dp)
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp)
                ) {
                    Text(
                        text = "TOTAL ESTIMATED SANDBOX BALANCE",
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Black,
                        color = TextSecondary,
                        letterSpacing = 1.sp
                    )

                    Spacer(modifier = Modifier.height(4.dp))

                    Text(
                        text = String.format("$%,.2f USD", totalBalanceValue),
                        fontSize = 28.sp,
                        fontWeight = FontWeight.Black,
                        color = Web3Mint,
                        letterSpacing = 0.5.sp
                    )

                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        modifier = Modifier.padding(top = 4.dp)
                    ) {
                        Icon(
                            Icons.Default.TrendingUp,
                            contentDescription = "Trending Up",
                            tint = Web3Mint,
                            modifier = Modifier.size(14.dp)
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = "+4.85% (Simulated 24h Ticks)",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = Web3Mint
                        )
                    }

                    Spacer(modifier = Modifier.height(14.dp))
                    HorizontalDivider(color = DividerPurple)
                    Spacer(modifier = Modifier.height(10.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(Icons.Default.Info, contentDescription = null, tint = Web3Cyan, modifier = Modifier.size(14.dp))
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            "This simulated capital updates dynamically matching active Network configurations.",
                            fontSize = 10.sp,
                            color = TextSecondary
                        )
                    }
                }
            }
        }

        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = Web3SurfaceCard),
                shape = RoundedCornerShape(12.dp),
                border = BorderStroke(1.dp, CardBorder)
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "ESTIMATED VOLATILITY INDEX CHART",
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Black,
                            color = Web3Cyan,
                            letterSpacing = 0.5.sp
                        )
                        Text(
                            text = "Live Ticks",
                            fontSize = 9.sp,
                            fontWeight = FontWeight.Bold,
                            color = Web3Mint,
                            modifier = Modifier
                                .background(Web3Mint.copy(0.1f), RoundedCornerShape(4.dp))
                                .padding(horizontal = 6.dp, vertical = 2.dp)
                        )
                    }

                    Spacer(modifier = Modifier.height(14.dp))

                    val ethAsset = assets.firstOrNull { it.symbol == "ETH" || it.symbol == "POL" }
                    val plotPoints = ethAsset?.priceHistory ?: listOf(3400f, 3410f, 3390f, 3420f, 3430f)
                    Spacer(modifier = Modifier.height(8.dp))
                    SparklineChart(
                        dataPoints = plotPoints,
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(100.dp)
                            .background(Web3Obsidian, RoundedCornerShape(6.dp))
                            .padding(8.dp),
                        lineColor = Web3Cyan
                    )
                    
                    Spacer(modifier = Modifier.height(12.dp))
                    
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text("24h Low: $${String.format("%.2f", plotPoints.minOrNull() ?: 0f)}", fontSize = 10.sp, color = TextMuted)
                        Text("Network: ${activeNetwork.displayName}", fontSize = 10.sp, color = TextMuted)
                        Text("24h High: $${String.format("%.2f", plotPoints.maxOrNull() ?: 100f)}", fontSize = 10.sp, color = TextMuted)
                    }
                }
            }
        }

        item {
            Text(
                "TOKEN ASSET COMPOSITION",
                fontSize = 10.sp,
                fontWeight = FontWeight.Black,
                color = Web3Cyan,
                letterSpacing = 1.sp
            )
        }

        items(assets) { asset ->
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(Web3SurfaceCard, RoundedCornerShape(10.dp))
                    .border(1.dp, CardBorder, RoundedCornerShape(10.dp))
                    .padding(12.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .size(32.dp)
                            .background(DividerPurple, RoundedCornerShape(8.dp)),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = asset.symbol.take(1),
                            fontFamily = FontFamily.Monospace,
                            fontWeight = FontWeight.Bold,
                            color = Web3Cyan,
                            fontSize = 14.sp
                        )
                    }

                    Spacer(modifier = Modifier.width(10.dp))

                    Column {
                        Text(asset.name, fontSize = 12.sp, fontWeight = FontWeight.Bold, color = TextPrimary)
                        Text(
                            text = if (asset.priceUsd > 0) String.format("$%,.2f USD", asset.priceUsd) else "Sepolia Test Token",
                            fontSize = 10.sp,
                            color = TextSecondary
                        )
                    }
                }

                Column(horizontalAlignment = Alignment.End) {
                    Text(
                        text = "${asset.balance} ${asset.symbol}",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Black,
                        color = TextPrimary,
                        fontFamily = FontFamily.Monospace
                    )
                    Text(
                        text = String.format("$%,.2f", asset.balance * asset.priceUsd),
                        fontSize = 10.sp,
                        color = Web3Mint,
                        fontFamily = FontFamily.Monospace
                    )
                }
            }
        }

        item {
            Spacer(modifier = Modifier.height(10.dp))
            Text(
                "HISTORICAL SANDBOX TRANSACTION LEDGER",
                fontSize = 10.sp,
                fontWeight = FontWeight.Black,
                color = Web3Cyan,
                letterSpacing = 1.sp
            )
        }

        if (transactionHistory.isEmpty()) {
            item {
                Card(
                    colors = CardDefaults.cardColors(containerColor = Web3SurfaceCard.copy(alpha = 0.4f)),
                    shape = RoundedCornerShape(8.dp),
                    border = BorderStroke(1.dp, DividerPurple)
                ) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(24.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Text("No transactions signed or broadcasted yet.", color = TextMuted, fontSize = 11.sp)
                    }
                }
            }
        } else {
            items(transactionHistory) { tx ->
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(Web3SurfaceDark, RoundedCornerShape(8.dp))
                        .border(1.dp, CardBorder, RoundedCornerShape(8.dp))
                        .padding(10.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            Icons.Default.Check,
                            contentDescription = "Confirmed",
                            tint = Web3Mint,
                            modifier = Modifier.size(16.dp)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(tx.message, fontSize = 11.sp, color = TextPrimary, fontWeight = FontWeight.Medium)
                    }
                    Text(tx.time, fontSize = 10.sp, fontFamily = FontFamily.Monospace, color = TextMuted)
                }
            }
        }

        item {
            Spacer(modifier = Modifier.height(24.dp))
        }
    }
}

// ==========================================
// TERMINAL LOGGER OUTPUT FOOTER CARD
// ==========================================

@Composable
fun TerminalLogsPanel(
    viewModel: Web3ViewModel
) {
    val logs by viewModel.simulationLogs.collectAsStateWithLifecycle()
    var isExpanded by remember { mutableStateOf(false) }

    Card(
        colors = CardDefaults.cardColors(containerColor = Web3SurfaceDark),
        shape = RoundedCornerShape(topStart = 16.dp, topEnd = 16.dp),
        border = BorderStroke(1.dp, DividerPurple),
        modifier = Modifier
            .fillMaxWidth()
            .then(if (isExpanded) Modifier.height(260.dp) else Modifier.height(60.dp))
    ) {
        Column(modifier = Modifier.fillMaxSize()) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable { isExpanded = !isExpanded }
                    .padding(horizontal = 16.dp, vertical = 12.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .size(8.dp)
                            .background(Web3Mint, CircleShape)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "WEB3 COMPILER CLIENT LOGS (${logs.size})",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Black,
                        color = TextPrimary,
                        letterSpacing = 0.5.sp
                    )
                }

                Row(verticalAlignment = Alignment.CenterVertically) {
                    if (isExpanded) {
                        IconButton(
                            onClick = { viewModel.clearLogs() },
                            modifier = Modifier.size(24.dp)
                        ) {
                            Icon(Icons.Default.Delete, contentDescription = "Clear logs", tint = TextSecondary, modifier = Modifier.size(14.dp))
                        }
                        Spacer(modifier = Modifier.width(8.dp))
                    }
                    Icon(
                        imageVector = if (isExpanded) Icons.Default.KeyboardArrowDown else Icons.Default.KeyboardArrowUp,
                        contentDescription = "Expand logs",
                        tint = TextSecondary,
                        modifier = Modifier.size(16.dp)
                    )
                }
            }

            if (isExpanded) {
                HorizontalDivider(color = DividerPurple)
                
                if (logs.isEmpty()) {
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .background(Web3Obsidian),
                        contentAlignment = Alignment.Center
                    ) {
                        Text("Terminal listening. Fire actions inside sandbox.", fontSize = 11.sp, color = TextMuted)
                    }
                } else {
                    LazyColumn(
                        modifier = Modifier
                            .fillMaxSize()
                            .background(Web3Obsidian)
                            .padding(12.dp),
                        verticalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        items(logs, key = { it.id }) { log ->
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                verticalAlignment = Alignment.Top
                            ) {
                                Text(
                                    text = "[${log.time}] ",
                                    fontFamily = FontFamily.Monospace,
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = TextMuted
                                )
                                Text(
                                    text = "${log.type}: ",
                                    fontFamily = FontFamily.Monospace,
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.Black,
                                    color = when(log.type) {
                                        "ERR", "ALERT" -> Web3Pink
                                        "DIAGNOSTICS" -> Web3Cyan
                                        "TRANSACTION" -> Web3Mint
                                        "SIGNATURE" -> Web3Amber
                                        else -> EthereumPurple
                                    }
                                )
                                Text(
                                    text = log.message,
                                    fontFamily = FontFamily.Monospace,
                                    fontSize = 10.sp,
                                    color = TextSecondary,
                                    lineHeight = 14.sp,
                                    modifier = Modifier.weight(1f)
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}

// ==========================================
// METAMASK EMULATOR BOTTOM POPUP
// ==========================================

@Composable
fun MetaMaskEmulatorDialog(
    request: DappTransaction,
    walletAddress: String,
    network: Network,
    isMetaMaskLocked: Boolean,
    onApprove: (GasPreference) -> Unit,
    onReject: () -> Unit,
    onUnlockMetaMask: () -> Unit
) {
    var gasPreference by remember { mutableStateOf(GasPreference.MARKET) }
    var passwordInput by remember { mutableStateOf("") }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.Black.copy(alpha = 0.70f))
            .clickable(
                interactionSource = remember { MutableInteractionSource() },
                indication = null
            ) { /* No-Op */ },
        contentAlignment = Alignment.BottomCenter
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .fillMaxHeight(0.85f)
                .background(Web3SurfaceDark, RoundedCornerShape(topStart = 20.dp, topEnd = 20.dp))
                .border(1.dp, CardBorder, RoundedCornerShape(topStart = 20.dp, topEnd = 20.dp))
                .windowInsetsPadding(WindowInsets.navigationBars)
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(Web3SurfaceCard)
                    .padding(16.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .size(34.dp)
                            .background(Color(0xFFE2761B), CircleShape),
                        contentAlignment = Alignment.Center
                    ) {
                        Text("🦊", fontSize = 20.sp)
                    }

                    Spacer(modifier = Modifier.width(10.dp))

                    Column {
                        Text("MetaMask Emulator", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = TextPrimary)
                        Text(request.dappUrl, fontSize = 10.sp, color = Web3Cyan)
                    }
                }

                IconButton(
                    onClick = onReject,
                    modifier = Modifier.size(24.dp)
                ) {
                    Icon(Icons.Default.Close, contentDescription = "Close", tint = TextSecondary)
                }
            }

            HorizontalDivider(color = DividerPurple)

            if (isMetaMaskLocked) {
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(24.dp),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center
                ) {
                    Text("🦊", fontSize = 60.sp)
                    Spacer(modifier = Modifier.height(14.dp))
                    Text(
                        text = "MetaMask is Locked",
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold,
                        color = TextPrimary
                    )
                    Text(
                        text = "Enter any passcode to resolve keychain database and approve simulation payload.",
                        fontSize = 11.sp,
                        color = TextSecondary,
                        textAlign = TextAlign.Center,
                        modifier = Modifier
                            .padding(horizontal = 24.dp)
                            .padding(top = 4.dp)
                    )

                    Spacer(modifier = Modifier.height(20.dp))

                    OutlinedTextField(
                        value = passwordInput,
                        onValueChange = { passwordInput = it },
                        label = { Text("Enter Passcode Pattern") },
                        singleLine = true,
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedTextColor = TextPrimary,
                            unfocusedTextColor = TextPrimary,
                            focusedBorderColor = Web3Mint,
                            unfocusedBorderColor = CardBorder
                        ),
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 16.dp)
                            .testTag("metamask_password_input")
                    )

                    Spacer(modifier = Modifier.height(16.dp))

                    Button(
                        onClick = {
                            if (passwordInput.isNotBlank()) {
                                onUnlockMetaMask()
                            }
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = Web3Mint),
                        shape = RoundedCornerShape(8.dp),
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(44.dp)
                            .padding(horizontal = 16.dp)
                            .testTag("metamask_unlock_submit")
                    ) {
                        Text("Unlock Companion Vault", color = Web3Obsidian, fontWeight = FontWeight.Bold)
                    }
                }
            } else {
                LazyColumn(
                    modifier = Modifier
                        .weight(1f)
                        .padding(20.dp),
                    verticalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    item {
                        Card(
                            colors = CardDefaults.cardColors(containerColor = Web3Obsidian),
                            shape = RoundedCornerShape(10.dp),
                            border = BorderStroke(1.dp, CardBorder)
                        ) {
                            Column(modifier = Modifier.padding(14.dp)) {
                                Row(
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    modifier = Modifier.fillMaxWidth()
                                ) {
                                    Text(
                                        text = "REQUEST TYPE",
                                        fontSize = 10.sp,
                                        fontWeight = FontWeight.Black,
                                        color = TextMuted,
                                        letterSpacing = 0.5.sp
                                    )
                                    val pillColor = when(request.type) {
                                        TxType.CONNECT -> Web3Cyan
                                        TxType.SIGN_MESSAGE -> Web3Amber
                                        TxType.SEND_TRANSACTION -> Web3Pink
                                    }
                                    Text(
                                        text = request.type.name,
                                        fontSize = 9.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = pillColor,
                                        modifier = Modifier
                                            .background(pillColor.copy(0.15f), RoundedCornerShape(4.dp))
                                            .padding(horizontal = 6.dp, vertical = 2.dp)
                                    )
                                }

                                Spacer(modifier = Modifier.height(10.dp))

                                Text(
                                    text = request.description,
                                    fontSize = 11.sp,
                                    color = TextPrimary,
                                    lineHeight = 16.sp
                                )
                            }
                        }
                    }

                    item {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .background(Web3SurfaceCard, RoundedCornerShape(8.dp))
                                .border(1.dp, CardBorder, RoundedCornerShape(8.dp))
                                .padding(12.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Box(modifier = Modifier.size(8.dp).background(network.color, CircleShape))
                                Spacer(modifier = Modifier.width(8.dp))
                                Text("Connecting Network", color = TextSecondary, fontSize = 11.sp)
                            }
                            Text(network.displayName, color = TextPrimary, fontWeight = FontWeight.Bold, fontSize = 11.sp)
                        }
                    }

                    item {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .background(Web3SurfaceCard, RoundedCornerShape(8.dp))
                                .border(1.dp, CardBorder, RoundedCornerShape(8.dp))
                                .padding(12.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text("Default Signer Account", color = TextSecondary, fontSize = 11.sp)
                            Text(
                                "${walletAddress.take(12)}...${walletAddress.takeLast(6)}",
                                fontFamily = FontFamily.Monospace,
                                color = TextPrimary,
                                fontWeight = FontWeight.Bold,
                                fontSize = 11.sp
                            )
                        }
                    }

                    if (request.type == TxType.SEND_TRANSACTION) {
                        item {
                            Column(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .background(Web3SurfaceCard, RoundedCornerShape(10.dp))
                                    .border(1.dp, CardBorder, RoundedCornerShape(10.dp))
                                    .padding(14.dp)
                            ) {
                                Text(
                                    "CONFIGURE NETWORK TRANSACTION FEE (GAS)",
                                    fontSize = 9.sp,
                                    fontWeight = FontWeight.Black,
                                    color = Web3Mint,
                                    letterSpacing = 0.5.sp
                                )

                                Spacer(modifier = Modifier.height(10.dp))

                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    GasPreference.values().forEach { pref ->
                                        val isSelected = pref == gasPreference
                                        val pColor = if (isSelected) Web3Mint else TextMuted
                                        
                                        Column(
                                            modifier = Modifier
                                                .weight(1f)
                                                .padding(horizontal = 4.dp)
                                                .background(if (isSelected) DividerPurple else Color.Transparent, RoundedCornerShape(6.dp))
                                                .border(1.dp, if (isSelected) CardBorder else DividerPurple, RoundedCornerShape(6.dp))
                                                .clickable { gasPreference = pref }
                                                .padding(6.dp),
                                            horizontalAlignment = Alignment.CenterHorizontally
                                        ) {
                                            Text(pref.name, fontSize = 9.sp, fontWeight = FontWeight.Black, color = pColor)
                                            val estCost = when(pref) {
                                                GasPreference.ECO -> "$0.10"
                                                GasPreference.MARKET -> "$1.40"
                                                GasPreference.AGGRESSIVE -> "$4.80"
                                            }
                                            Text(estCost, fontSize = 11.sp, fontWeight = FontWeight.Bold, color = TextPrimary, modifier = Modifier.padding(top = 2.dp))
                                        }
                                    }
                                }
                            }
                        }

                        item {
                            Card(
                                colors = CardDefaults.cardColors(containerColor = Web3Obsidian),
                                shape = RoundedCornerShape(8.dp),
                                border = BorderStroke(1.dp, DividerPurple)
                            ) {
                                Column(modifier = Modifier.padding(10.dp)) {
                                    Text("RPC DATA HEX LOAD", fontSize = 8.sp, color = TextMuted, fontWeight = FontWeight.Bold)
                                    Spacer(modifier = Modifier.height(4.dp))
                                    Text(
                                        text = request.payloadHex,
                                        fontFamily = FontFamily.Monospace,
                                        color = TextSecondary,
                                        fontSize = 9.sp,
                                        maxLines = 2,
                                        overflow = TextOverflow.Ellipsis
                                    )
                                }
                            }
                        }
                    }
                }

                HorizontalDivider(color = DividerPurple)
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Button(
                        onClick = onReject,
                        colors = ButtonDefaults.buttonColors(containerColor = Web3SurfaceCard),
                        shape = RoundedCornerShape(8.dp),
                        modifier = Modifier
                            .weight(1f)
                            .height(44.dp)
                            .testTag("metamask_reject_btn")
                    ) {
                        Text("Cancel", color = TextPrimary, fontWeight = FontWeight.Bold, fontSize = 12.sp)
                    }

                    Spacer(modifier = Modifier.width(12.dp))

                    Button(
                        onClick = { onApprove(gasPreference) },
                        colors = ButtonDefaults.buttonColors(containerColor = Web3Mint),
                        shape = RoundedCornerShape(8.dp),
                        modifier = Modifier
                            .weight(1f)
                            .height(44.dp)
                            .testTag("metamask_approve_btn")
                    ) {
                        Text(
                            text = when(request.type) {
                                TxType.CONNECT -> "Authorize Connection"
                                TxType.SIGN_MESSAGE -> "Sign Signature"
                                TxType.SEND_TRANSACTION -> "Confirm Send"
                            },
                            color = Web3Obsidian,
                            fontWeight = FontWeight.Bold,
                            fontSize = 12.sp
                        )
                    }
                }
            }
        }
    }
}

// ==========================================
// CUSTOM CANVAS DRAW SPARKLINE CHART
// ==========================================

@Composable
fun SparklineChart(
    dataPoints: List<Float>,
    modifier: Modifier = Modifier,
    lineColor: Color = Color.Cyan
) {
    Canvas(modifier = modifier) {
        if (dataPoints.size < 2) return@Canvas
        val width = size.width
        val height = size.height
        val minVal = dataPoints.minOrNull() ?: 0f
        val maxVal = dataPoints.maxOrNull() ?: 100f
        val valRange = (maxVal - minVal).let { if (it == 0f) 1f else it }
        
        val path = Path()
        val fillPath = Path()
        
        val points = dataPoints.mapIndexed { idx, value ->
            val x = (idx.toFloat() / (dataPoints.size - 1)) * width
            val y = height - ((value - minVal) / valRange) * height
            Offset(x, y)
        }
        
        path.moveTo(points.first().x, points.first().y)
        fillPath.moveTo(points.first().x, height)
        fillPath.lineTo(points.first().x, points.first().y)
        
        for (i in 1 until points.size) {
            val prev = points[i - 1]
            val curr = points[i]
            val cp1 = Offset(prev.x + (curr.x - prev.x) / 2f, prev.y)
            val cp2 = Offset(prev.x + (curr.x - prev.x) / 2f, curr.y)
            path.cubicTo(cp1.x, cp1.y, cp2.x, cp2.y, curr.x, curr.y)
            fillPath.cubicTo(cp1.x, cp1.y, cp2.x, cp2.y, curr.x, curr.y)
        }
        fillPath.lineTo(points.last().x, height)
        fillPath.close()
        
        drawPath(
            path = fillPath,
            brush = Brush.verticalGradient(
                colors = listOf(lineColor.copy(alpha = 0.22f), Color.Transparent),
                startY = 0f,
                endY = height
            )
        )
        
        drawPath(
            path = path,
            color = lineColor,
            style = Stroke(width = 2.dp.toPx(), cap = StrokeCap.Round, join = StrokeJoin.Round)
        )
        
        val endPoint = points.last()
        drawCircle(
            color = lineColor,
            radius = 3.5.dp.toPx(),
            center = endPoint
        )
        drawCircle(
            color = lineColor.copy(alpha = 0.35f),
            radius = 7.dp.toPx(),
            center = endPoint
        )
    }
}

// ==========================================
// TAB 4: SUPER ADMINISTRATOR SECURITY VIEW
// ==========================================

@Composable
fun AdminTabScreen(
    viewModel: Web3ViewModel
) {
    val auditLogs by viewModel.auditLogs.collectAsStateWithLifecycle()
    val adminUsers by viewModel.adminUsers.collectAsStateWithLifecycle()
    val isComplianceSuccess by viewModel.isAuditComplianceSuccess.collectAsStateWithLifecycle()
    val lastAuditTime by viewModel.lastAuditTimestamp.collectAsStateWithLifecycle()

    var newUserEmail by remember { mutableStateOf("") }
    var newUserRole by remember { mutableStateOf("Compliance Auditor") }
    var logFilter by remember { mutableStateOf("ALL") } // "ALL", "ADMIN", "SYSTEM"

    val rolesList = listOf("Compliance Auditor", "Sandbox Node Dev", "Anonymous Tester")

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        // Mock Browser Header Frame
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = Web3SurfaceDark),
                shape = RoundedCornerShape(12.dp),
                border = BorderStroke(1.dp, CardBorder),
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = 4.dp)
            ) {
                Column {
                    // Browser Top Chrome bar
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(Web3SurfaceCard)
                            .padding(horizontal = 12.dp, vertical = 8.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                            Box(modifier = Modifier.size(8.dp).background(Web3Pink, CircleShape))
                            Box(modifier = Modifier.size(8.dp).background(Web3Amber, CircleShape))
                            Box(modifier = Modifier.size(8.dp).background(Web3Mint, CircleShape))
                            
                            Spacer(modifier = Modifier.width(6.dp))
                            
                            Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = TextMuted, modifier = Modifier.size(12.dp))
                            Icon(Icons.Default.ArrowForward, contentDescription = "Forward", tint = TextMuted, modifier = Modifier.size(12.dp))
                        }

                        // Web secure URL input bar
                        Row(
                            modifier = Modifier
                                .weight(1f)
                                .padding(horizontal = 12.dp)
                                .background(Web3Obsidian, RoundedCornerShape(6.dp))
                                .border(1.dp, CardBorder, RoundedCornerShape(6.dp))
                                .padding(horizontal = 10.dp, vertical = 4.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(Icons.Default.Lock, contentDescription = "Secure link", tint = Web3Mint, modifier = Modifier.size(12.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(
                                text = "https://admin.metaconnect-mesh.net/sandbox/audi-compliance",
                                color = TextSecondary,
                                fontSize = 10.sp,
                                fontFamily = FontFamily.Monospace,
                                maxLines = 1,
                                overflow = TextOverflow.Ellipsis
                            )
                        }

                        // Active state badge
                        Text(
                            text = "WEB WORKSPACE",
                            fontSize = 8.sp,
                            fontWeight = FontWeight.Black,
                            color = Web3Cyan,
                            modifier = Modifier
                                .background(Web3Cyan.copy(alpha = 0.15f), RoundedCornerShape(4.dp))
                                .padding(horizontal = 6.dp, vertical = 2.dp)
                        )
                    }

                    // Super Admin Greeting info
                    Column(modifier = Modifier.padding(14.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Box(
                                    modifier = Modifier
                                        .size(34.dp)
                                        .background(Web3Cyan.copy(alpha = 0.15f), CircleShape),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Text("👑", fontSize = 16.sp)
                                }
                                Spacer(modifier = Modifier.width(10.dp))
                                Column {
                                    Text("Super Admin Portal (Jesús Pirela)", fontSize = 13.sp, fontWeight = FontWeight.Black, color = TextPrimary)
                                    Text("jess.pirela@gmail.com", fontSize = 10.sp, color = TextSecondary)
                                }
                            }
                            
                            // Security status pill
                            Text(
                                text = if (isComplianceSuccess) "SECURE PROFILE" else "WARNING: UNHANDLED ERRORS",
                                fontSize = 9.sp,
                                fontWeight = FontWeight.Bold,
                                color = if (isComplianceSuccess) Web3Mint else Web3Pink,
                                modifier = Modifier
                                    .background(if (isComplianceSuccess) Web3Mint.copy(alpha = 0.1f) else Web3Pink.copy(alpha = 0.1f), RoundedCornerShape(4.dp))
                                    .padding(horizontal = 8.dp, vertical = 4.dp)
                            )
                        }
                    }
                }
            }
        }

        // Section 1: Security Controls & AUDIT ENGINE
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = Web3SurfaceCard),
                shape = RoundedCornerShape(12.dp),
                border = BorderStroke(1.dp, CardBorder)
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    Text(
                        text = "REAL-TIME SECURITY RUNTIME COMPLIANCE ENGINE",
                        fontSize = 9.sp,
                        fontWeight = FontWeight.Black,
                        color = Web3Cyan,
                        letterSpacing = 1.sp
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "Manually trigger background integrity audits over active browser socket nodes. This asserts RPC response latency and verifies compiled key schemas.",
                        fontSize = 11.sp,
                        color = TextSecondary,
                        lineHeight = 15.sp
                    )

                    Spacer(modifier = Modifier.height(12.dp))
                    HorizontalDivider(color = DividerPurple)
                    Spacer(modifier = Modifier.height(12.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text("Last Audited Scan:", fontSize = 10.sp, color = TextMuted)
                            Text(
                                text = if (lastAuditTime.isNotEmpty()) lastAuditTime else "Not Scanned yet",
                                fontSize = 11.sp,
                                fontFamily = FontFamily.Monospace,
                                fontWeight = FontWeight.Bold,
                                color = TextPrimary
                            )
                        }

                        Column(horizontalAlignment = Alignment.End) {
                            Text("Compliance Integrity:", fontSize = 10.sp, color = TextMuted)
                            Text(
                                text = if (isComplianceSuccess) "100% SUCCESS" else "VIOLATIONS REMAIN",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Black,
                                color = if (isComplianceSuccess) Web3Mint else Web3Pink
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(14.dp))

                    Button(
                        onClick = { viewModel.triggerSuperAudit() },
                        colors = ButtonDefaults.buttonColors(containerColor = Web3Mint),
                        shape = RoundedCornerShape(8.dp),
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(42.dp)
                    ) {
                        Icon(Icons.Default.Shield, contentDescription = null, tint = Web3Obsidian, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("RUN SECURITY DIRECTIVE AUDIT", color = Web3Obsidian, fontWeight = FontWeight.Bold, fontSize = 12.sp)
                    }
                }
            }
        }

        // Section 2: User Registry Controls (Manejo de Usuarios)
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = Web3SurfaceCard),
                shape = RoundedCornerShape(12.dp),
                border = BorderStroke(1.dp, CardBorder)
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    Text(
                        text = "MANAGE ADMINISTRATIVE AUDITOR PROFILES",
                        fontSize = 9.sp,
                        fontWeight = FontWeight.Black,
                        color = Web3Cyan,
                        letterSpacing = 1.sp
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "Add simulated audit actors or block security mesh adapters temporarily to test isolation policy constraints.",
                        fontSize = 11.sp,
                        color = TextSecondary,
                        lineHeight = 15.sp
                    )

                    Spacer(modifier = Modifier.height(14.dp))

                    OutlinedTextField(
                        value = newUserEmail,
                        onValueChange = { newUserEmail = it },
                        label = { Text("Enter Auditor Email Key") },
                        singleLine = true,
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedTextColor = TextPrimary,
                            unfocusedTextColor = TextPrimary,
                            focusedBorderColor = Web3Mint,
                            unfocusedBorderColor = CardBorder,
                            focusedContainerColor = Web3Obsidian,
                            unfocusedContainerColor = Web3Obsidian
                        ),
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(bottom = 10.dp)
                    )

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        rolesList.forEach { role ->
                            val isSelected = newUserRole == role
                            Text(
                                text = role,
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold,
                                color = if (isSelected) Web3Obsidian else TextMuted,
                                modifier = Modifier
                                    .weight(1f)
                                    .background(
                                        if (isSelected) Web3Mint else DividerPurple,
                                        RoundedCornerShape(6.dp)
                                    )
                                    .clickable { newUserRole = role }
                                    .padding(vertical = 8.dp)
                                    .wrapContentWidth(Alignment.CenterHorizontally)
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    Button(
                        onClick = {
                            if (newUserEmail.isNotBlank()) {
                                viewModel.addUser(newUserEmail, newUserRole)
                                newUserEmail = ""
                            }
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = DividerPurple),
                        shape = RoundedCornerShape(6.dp),
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(38.dp)
                    ) {
                        Icon(Icons.Default.Add, contentDescription = null, tint = Web3Cyan, modifier = Modifier.size(14.dp))
                        Spacer(modifier = Modifier.width(6.dp))
                        Text("Add Sandbox Auditor Profile", color = Web3Cyan, fontWeight = FontWeight.Bold, fontSize = 11.sp)
                    }
                }
            }
        }

        // Section 3: Administrative Users List (Manejo de Usuarios)
        item {
            Text(
                text = "ACTIVE SIMULATED ADAPTER AUDITORS (${adminUsers.size})",
                fontSize = 11.sp,
                fontWeight = FontWeight.Black,
                color = Web3Cyan,
                letterSpacing = 1.sp
            )
        }

        items(adminUsers) { user ->
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(Web3SurfaceCard, RoundedCornerShape(10.dp))
                    .border(1.dp, if (user.isBlocked) Web3Pink.copy(0.4f) else CardBorder, RoundedCornerShape(10.dp))
                    .padding(12.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Row(modifier = Modifier.weight(1f), verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .size(32.dp)
                            .background(if (user.isBlocked) Web3Pink.copy(0.2f) else DividerPurple, RoundedCornerShape(8.dp)),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = if (user.isBlocked) "🔒" else "👤",
                            fontSize = 14.sp
                        )
                    }

                    Spacer(modifier = Modifier.width(10.dp))

                    Column {
                        Text(
                            text = user.email,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            color = if (user.isBlocked) Web3Pink else TextPrimary,
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis
                        )
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(user.role, fontSize = 10.sp, color = TextSecondary)
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(
                                text = "Lvl ${user.level}",
                                fontSize = 8.sp,
                                color = Web3Cyan,
                                fontWeight = FontWeight.Bold,
                                modifier = Modifier
                                    .background(Web3Cyan.copy(0.15f), RoundedCornerShape(4.dp))
                                    .padding(horizontal = 4.dp, vertical = 2.dp)
                            )
                        }
                    }
                }

                Column(horizontalAlignment = Alignment.End) {
                    Button(
                        onClick = { viewModel.toggleBlockUser(user.email) },
                        colors = ButtonDefaults.buttonColors(
                            containerColor = if (user.isBlocked) Web3Mint else Web3Pink.copy(0.15f),
                            contentColor = if (user.isBlocked) Web3Obsidian else Web3Pink
                        ),
                        contentPadding = PaddingValues(horizontal = 8.dp, vertical = 4.dp),
                        modifier = Modifier.height(28.dp),
                        shape = RoundedCornerShape(6.dp)
                    ) {
                        Text(
                            text = if (user.isBlocked) "ACTIVATE" else "LOCK PORT",
                            fontSize = 8.sp,
                            fontWeight = FontWeight.Black
                        )
                    }
                }
            }
        }

        // Section 4: Audit Logs (Historial de Cambios)
        item {
            Row(
                modifier = Modifier.fillMaxWidth().padding(top = 10.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "HISTORIAL DE CAMBIOS & INCIDENCIAS",
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Black,
                    color = Web3Cyan,
                    letterSpacing = 1.sp
                )

                Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                    listOf("ALL", "ADMIN", "SYSTEM").forEach { f ->
                        val isSel = logFilter == f
                        Text(
                            text = f,
                            fontSize = 8.sp,
                            fontWeight = FontWeight.Bold,
                            color = if (isSel) Web3Obsidian else TextMuted,
                            modifier = Modifier
                                .background(if (isSel) Web3Mint else DividerPurple, RoundedCornerShape(4.dp))
                                .clickable { logFilter = f }
                                .padding(horizontal = 6.dp, vertical = 3.dp)
                        )
                    }
                }
            }
        }

        val filteredLogs = auditLogs.filter { log ->
            when (logFilter) {
                "ALL" -> true
                "ADMIN" -> log.author == "Super Admin"
                "SYSTEM" -> log.author == "System" || log.author == "System Auditor" || log.author == "Sentinel Node"
                else -> true
            }
        }

        if (filteredLogs.isEmpty()) {
            item {
                Card(
                    colors = CardDefaults.cardColors(containerColor = Web3SurfaceCard.copy(alpha = 0.5f)),
                    shape = RoundedCornerShape(8.dp),
                    border = BorderStroke(1.dp, DividerPurple)
                ) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(24.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Text("No audit log matches for filters.", color = TextMuted, fontSize = 11.sp)
                    }
                }
            }
        } else {
            items(filteredLogs) { log ->
                Card(
                    colors = CardDefaults.cardColors(containerColor = Web3SurfaceDark),
                    shape = RoundedCornerShape(8.dp),
                    border = BorderStroke(
                        1.dp,
                        when (log.severity) {
                            "CRIT" -> Web3Pink.copy(0.6f)
                            "WARN" -> Web3Amber.copy(0.6f)
                            else -> CardBorder
                        }
                    )
                ) {
                    Column(modifier = Modifier.padding(10.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                val authorColor = when(log.author) {
                                    "Super Admin" -> Web3Mint
                                    "System", "System Auditor", "Sentinel Node" -> Web3Cyan
                                    else -> Web3Amber
                                }
                                Text(
                                    text = log.author,
                                    fontSize = 9.sp,
                                    fontWeight = FontWeight.Black,
                                    color = authorColor,
                                    modifier = Modifier
                                        .background(authorColor.copy(alpha = 0.15f), RoundedCornerShape(4.dp))
                                        .padding(horizontal = 6.dp, vertical = 2.dp)
                                )

                                Spacer(modifier = Modifier.width(6.dp))

                                Text(
                                    text = log.action,
                                    fontSize = 9.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = TextPrimary,
                                    fontFamily = FontFamily.Monospace
                                )
                            }

                            Text(
                                text = log.timestamp,
                                fontSize = 9.sp,
                                fontFamily = FontFamily.Monospace,
                                color = TextMuted
                            )
                        }

                        Spacer(modifier = Modifier.height(6.dp))
                        Text(
                            text = log.details,
                            fontSize = 11.sp,
                            color = TextSecondary,
                            lineHeight = 15.sp
                        )
                    }
                }
            }
        }

        item {
            Spacer(modifier = Modifier.height(24.dp))
        }
    }
}
