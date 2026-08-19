import React from 'react';
import { AgreementDetailModal } from './AgreementDetailModal';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * 设置页「查看政策」按钮打开的隐私政策弹窗
 * 为了与启动时 ConsentModal 中点「隐私政策」看到的内容像素级一致，
 * 这里直接复用同一个 AgreementDetailModal 组件，只传 type='privacy'。
 * 保证两边结构、样式、正文内容永远同步，不会出现内容差异。
 */
export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  return (
    <AgreementDetailModal isOpen={isOpen} type="privacy" onClose={onClose} zIndex={100} />
  );
};
