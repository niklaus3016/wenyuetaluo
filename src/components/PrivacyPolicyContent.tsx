export function PrivacyPolicyContent() {
  return (
    <div className="max-w-none text-[15px] leading-[1.9] text-[#C9D4FF]">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4C296]/10 border border-[#D4C296]/20 mb-5">
          <span className="text-[#D4C296] text-xs tracking-[0.2em]">MOON TAROT · 问月塔罗</span>
        </div>
        <h1 className="text-2xl font-bold text-[#D4C296] mb-3" style={{ fontFamily: "'Noto Serif SC', serif" }}>
          🔒 隐私政策
        </h1>
        <p className="text-sm text-[#8D9BC8]">
          <strong className="text-[#A8B4D8]">生效日期</strong>：2026年08月20日
        </p>
      </div>

      {/* 引言卡片 - 金色左边框 */}
      <div className="mb-8 p-5 rounded-2xl bg-gradient-to-r from-[#D4C296]/10 via-[#7B68EE]/5 to-transparent border-l-4 border-[#D4C296]">
        <p className="text-[#C9D4FF]">
          欢迎使用「<strong className="text-[#D4C296]">问月塔罗</strong>」（以下简称"本应用"）。本应用由
          <strong className="text-[#D4C296]"> 深圳丰佰瑞网络科技有限公司 </strong>
          （以下简称"我们"）开发并运营。我们深知个人信息对您的重要性，将严格遵守
          《中华人民共和国个人信息保护法》《网络安全法》等相关法律法规，恪守
          <strong className="text-[#7B68EE]">"数据不入云、权限零索取、隐私不出设备"</strong>
          的极致隐私保护理念，守护您的每一次心愿与抽牌。
        </p>
      </div>

      <p className="mb-6 text-[#C9D4FF]">
        本隐私政策旨在说明我们如何收集、使用、存储和保护您在使用本应用过程中提供的个人信息，
        以及您对这些信息所享有的权利。请您在使用本应用前仔细阅读并充分理解本政策的全部内容，
        尤其是<strong className="text-[#F5F7FF]">加粗的条款</strong>。
        如您对本政策有任何疑问、意见或建议，可通过本政策末尾提供的联系方式与我们联系。
      </p>

      <h2 className="text-lg font-semibold text-[#D4C296] mt-10 mb-4 pb-3 border-b border-[#D4C296]/20" style={{ fontFamily: "'Noto Serif SC', serif" }}>
        一、我们收集的信息
      </h2>
      <p className="mb-4 text-[#C9D4FF]">
        问月塔罗遵循<strong className="text-[#F5F7FF]">"最少够用"</strong>原则。
        在您使用本应用的过程中，我们仅会收集以下<strong className="text-[#F5F7FF]">存储于您本人设备本地</strong>的信息，<strong className="text-[#D4C296]">绝不会上传到任何远程服务器</strong>：
      </p>
      <ol className="list-decimal pl-6 mb-6 space-y-3">
        <li className="text-[#C9D4FF]">
          <strong className="text-[#F5F7FF]">占卜记录与收藏</strong>：您在使用本应用过程中主动产生的
          <strong className="text-[#7B68EE]"> 占卜问题、抽牌结果、牌阵选择、历史记录、卡牌收藏、每日月运结果</strong>。
          这些数据是本应用的核心功能内容，用于为您提供历史复盘、占卜回顾、收藏管理等服务，全部保存于您的设备本地浏览器存储空间（localStorage）。
        </li>
        <li className="text-[#C9D4FF]">
          <strong className="text-[#F5F7FF]">个性化偏好设置</strong>：您主动选择的
          <strong className="text-[#7B68EE]"> 音效开关、背景音量、动画模式（丝滑/省电）、当前静心音景</strong>。
          这些设置仅用于给您提供更贴合使用习惯的沉浸式体验。
        </li>
        <li className="text-[#C9D4FF]">
          <strong className="text-[#F5F7FF]">零敏感设备信息</strong>：
          与多数应用不同，本应用<strong className="text-[#D4C296]">不采集设备型号、操作系统版本、IMEI、Android ID、MAC 地址、IP 地址</strong>等任何设备标识符。
          打包为 Android App 后仅声明最低限度的 INTERNET 权限，用于加载 CDN 上的塔罗牌图片资源，该请求不携带任何用户身份信息。
        </li>
      </ol>

      <h2 className="text-lg font-semibold text-[#D4C296] mt-10 mb-4 pb-3 border-b border-[#D4C296]/20" style={{ fontFamily: "'Noto Serif SC', serif" }}>
        二、我们如何使用收集的信息
      </h2>
      <p className="mb-4 text-[#C9D4FF]">
        我们仅会在以下<strong className="text-[#F5F7FF]">合法、正当、必要、且不出本机</strong>的范围内使用您的信息：
      </p>
      <ol className="list-decimal pl-6 mb-6 space-y-3">
        <li className="text-[#C9D4FF]">
          <strong className="text-[#F5F7FF]">提供与维护核心服务</strong>：使用您的占卜记录、收藏和设置偏好，为您实现牌阵占卜、历史复盘、卡牌百科、每日月运、静心白噪音、个性化界面设置等核心功能。
        </li>
        <li className="text-[#C9D4FF]">
          <strong className="text-[#F5F7FF]">不做任何数据分析与统计</strong>：
          我们<strong className="text-[#D4C296]">不接入任何第三方统计 SDK、不做用户画像、不做埋点分析、不投放广告</strong>。
          您的抽牌与心愿只属于您自己。
        </li>
      </ol>

      <h2 className="text-lg font-semibold text-[#D4C296] mt-10 mb-4 pb-3 border-b border-[#D4C296]/20" style={{ fontFamily: "'Noto Serif SC', serif" }}>
        三、我们如何共享、转让和公开披露信息
      </h2>
      <p className="mb-4 text-[#C9D4FF]">
        我们郑重承诺：<strong className="text-[#D4C296]">您的所有占卜记录、收藏与偏好数据 100% 存储于您本人设备本地</strong>，
        我们的服务器上不会留存任何副本。因此不存在向任何第三方共享、转让或公开披露您个人信息的基础：
      </p>
      <ol className="list-decimal pl-6 mb-6 space-y-3">
        <li className="text-[#C9D4FF]">
          <strong className="text-[#F5F7FF]">零第三方 SDK</strong>：
          本应用未集成任何第三方广告、统计、推送、支付、定位、埋点类 SDK。除必需的 Capacitor（WebView 桥接）外无其他数据共享方。
        </li>
        <li className="text-[#C9D4FF]">
          <strong className="text-[#F5F7FF]">法定情形</strong>：
          如遇法律法规的强制性规定或有权行政、司法机关的合法调取请求，我们仍会在法定范围内尽最大努力保护您的隐私权益——但因本应用无云端存储，我们客观上无法提供您的本地占卜数据内容。
        </li>
        <li className="text-[#C9D4FF]">
          <strong className="text-[#F5F7FF]">获得明确同意</strong>：
          任何其他情形下的信息共享，我们均会单独获取您的明确书面同意。
        </li>
      </ol>

      <h2 className="text-lg font-semibold text-[#D4C296] mt-10 mb-4 pb-3 border-b border-[#D4C296]/20" style={{ fontFamily: "'Noto Serif SC', serif" }}>
        四、我们如何存储和保护信息
      </h2>
      <ol className="list-decimal pl-6 mb-6 space-y-3">
        <li className="text-[#C9D4FF]">
          <strong className="text-[#F5F7FF]">存储地点</strong>：
          您的全部个人信息仅存储于<strong className="text-[#7B68EE]">您所使用设备的本地浏览器 localStorage</strong>（或 Android App 的 WebView 本地存储区）中，存储地域即您本人所在位置，<strong className="text-[#D4C296]">不会跨境、不会上传、不会同步</strong>。
        </li>
        <li className="text-[#C9D4FF]">
          <strong className="text-[#F5F7FF]">存储期限</strong>：
          我们会在您主动删除前持续保留这些数据；您可以随时在「设置」中一键清空全部本地数据，或通过卸载 App、清除浏览器数据的方式一次性彻底销毁。
        </li>
        <li className="text-[#C9D4FF]">
          <strong className="text-[#F5F7FF]">安全措施</strong>：
          数据因完全本地化而天然享有物理隔离的安全优势。我们同时要求自身仅使用最小必要的存储键、不记录敏感明文；即便在本地，占卜问题、结果等内容也不会离开本应用沙箱环境。
        </li>
      </ol>

      <h2 className="text-lg font-semibold text-[#D4C296] mt-10 mb-4 pb-3 border-b border-[#D4C296]/20" style={{ fontFamily: "'Noto Serif SC', serif" }}>
        五、您的权利
      </h2>
      <p className="mb-4 text-[#C9D4FF]">
        根据相关法律法规，结合本应用极致本地化的特点，您对您的个人信息享有以下完整权利：
      </p>
      <ol className="list-decimal pl-6 mb-6 space-y-3">
        <li className="text-[#C9D4FF]"><strong className="text-[#F5F7FF]">访问权</strong>：您可以随时在「占卜记录」与「我的收藏」中查看全部占卜历史与卡牌收藏。</li>
        <li className="text-[#C9D4FF]"><strong className="text-[#F5F7FF]">更正权</strong>：如您需要调整收藏或历史，可在「卡牌百科」中取消收藏，或在「占卜记录」中删除单条记录。</li>
        <li className="text-[#C9D4FF]"><strong className="text-[#F5F7FF]">删除权</strong>：您可以单条删除历史记录，也可以在「设置 → 数据与隐私」中点击<strong className="text-[#D4C296]">「一键清空全部数据」</strong>，应用将立即且不可逆转地清空全部本地存储内容。</li>
        <li className="text-[#C9D4FF]"><strong className="text-[#F5F7FF]">数据导出与可携带权</strong>：由于所有数据均在本地，您可以通过系统级备份、截图保存、以及在「占卜结果」中<strong className="text-[#7B68EE]">生成长图保存</strong>等方式自由导出您的数据。</li>
        <li className="text-[#C9D4FF]"><strong className="text-[#F5F7FF]">撤回同意权</strong>：您可以通过本政策第八节的联系方式随时撤回此前的同意，我们不会因此对您设置任何门槛或差别待遇。</li>
      </ol>

      <h2 className="text-lg font-semibold text-[#D4C296] mt-10 mb-4 pb-3 border-b border-[#D4C296]/20" style={{ fontFamily: "'Noto Serif SC', serif" }}>
        六、未成年人保护
      </h2>
      <p className="mb-6 text-[#C9D4FF]">
        我们非常重视对未成年人个人信息的保护。如您是未满 14 周岁的未成年人，在使用本应用前，
        应在监护人的指导下仔细阅读本政策，并征得监护人的同意。
        如我们发现自己在未事先获得监护人可验证同意的情况下收集了未成年人的个人信息，
        将立即通过技术手段协助监护人在本地销毁相关数据。
      </p>

      <h2 className="text-lg font-semibold text-[#D4C296] mt-10 mb-4 pb-3 border-b border-[#D4C296]/20" style={{ fontFamily: "'Noto Serif SC', serif" }}>
        七、本政策的更新
      </h2>
      <p className="mb-6 text-[#C9D4FF]">
        我们可能会根据法律法规的更新、业务的调整或技术的发展，适时对本隐私政策进行修订。
        修订后的政策将在本应用内显著位置公示，并在生效前通过合理方式通知您；
        重大变更时将重新征求您的同意。如您继续使用本应用，即表示您同意接受修订后的政策。
      </p>

      <h2 className="text-lg font-semibold text-[#D4C296] mt-10 mb-4 pb-3 border-b border-[#D4C296]/20" style={{ fontFamily: "'Noto Serif SC', serif" }}>
        八、联系我们
      </h2>
      <p className="mb-4 text-[#C9D4FF]">
        如您对本隐私政策有任何疑问、意见或建议，或需要行使您的相关权利，请通过以下方式与我们联系：
      </p>
      <div className="p-5 rounded-2xl bg-[#1A2247]/80 border border-[#D4C296]/15 mb-6">
        <p className="mb-2 text-[#C9D4FF]">
          <strong className="text-[#D4C296]">运营主体</strong>：深圳丰佰瑞网络科技有限公司
        </p>
        <p className="text-[#C9D4FF]">
          <strong className="text-[#D4C296]">联系邮箱</strong>：Jp182025@163.com
        </p>
      </div>

      <div className="mt-10 pt-8 border-t border-[#D4C296]/15 text-center">
        <p className="mb-2 text-[#8D9BC8]">感谢你选择问月塔罗。</p>
        <p className="mb-4 text-[#8D9BC8]">愿每一次抽牌，都是与真实自己的温柔对话。</p>
        <p className="text-xs text-[#6B76A0]">© 2026 深圳丰佰瑞网络科技有限公司 版权所有</p>
      </div>
    </div>
  );
}
