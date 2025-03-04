package com.ssafy.sosangomin.common.converter;

import com.ssafy.sosangomin.common.annotation.DecryptedId;
import com.ssafy.sosangomin.common.util.IdEncryptionUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.core.convert.TypeDescriptor;
import org.springframework.core.convert.converter.ConditionalGenericConverter;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
@RequiredArgsConstructor
public class DecryptedIdConverter implements ConditionalGenericConverter {

    private final IdEncryptionUtil idEncryptionUtil;

    @Override
    public boolean matches(TypeDescriptor sourceType, TypeDescriptor targetType) {
        return targetType.hasAnnotation(DecryptedId.class);
    }

    @Override
    public Set<ConvertiblePair> getConvertibleTypes() {
        return Set.of(
                new ConvertiblePair(String.class, Long.class)
        );
    }

    @Override
    public Object convert(Object source, TypeDescriptor sourceType, TypeDescriptor targetType) {
        return idEncryptionUtil.decrypt((String) source);

    }
}