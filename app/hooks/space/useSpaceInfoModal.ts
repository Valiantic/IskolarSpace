import { useState, useCallback } from 'react';

const useSpaceInfoModal = () => {
  const [showSpaceInfo, setShowSpaceInfo] = useState(false);
  const openSpaceInfo = useCallback(() => setShowSpaceInfo(true), []);
  const closeSpaceInfo = useCallback(() => setShowSpaceInfo(false), []);
  return { showSpaceInfo, openSpaceInfo, closeSpaceInfo };
};

export default useSpaceInfoModal;
