package com.ldawspt.service;

import com.ldawspt.dto.CertificateDto;
import com.ldawspt.entity.Certificate;

import java.util.List;

public interface CertificateService {

    CertificateDto getOrCreateCertificate(Long userId, Long courseId);

    List<CertificateDto> getCertificatesByUserId(Long userId);

    Certificate getCertificateEntityByUuid(String uuid);
}
