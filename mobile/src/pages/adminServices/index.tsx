import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  Switch,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { makeStyles } from './styles';
import { useTheme } from '../../contexts/ThemeContext';
import {
  Service,
  getAllServices,
  createService,
  updateService,
  toggleServiceActive,
  deleteService,
} from '../../api/services';

export default function AdminServices() {
  const navigation      = useNavigation();
  const { theme }       = useTheme();
  const styles          = makeStyles(theme);

  const [services, setServices]   = useState<Service[]>([]);
  const [loading, setLoading]     = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // form
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formName, setFormName]             = useState('');
  const [formDesc, setFormDesc]             = useState('');
  const [formDuration, setFormDuration]     = useState('30');
  const [saving, setSaving]                 = useState(false);

  // ── dados ──────────────────────────────────────────────────────────────────

  const loadServices = useCallback(async () => {
    try {
      const data = await getAllServices();
      setServices(data);
    } catch (error: any) {
      Alert.alert('Erro', error.message);
    }
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadServices();
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => { loadServices(); }, [loadServices])
  );

  // ── form ───────────────────────────────────────────────────────────────────

  const openCreate = () => {
    setEditingService(null);
    setFormName('');
    setFormDesc('');
    setFormDuration('30');
    setShowModal(true);
  };

  const openEdit = (service: Service) => {
    setEditingService(service);
    setFormName(service.name);
    setFormDesc(service.description ?? '');
    setFormDuration(String(service.duration_min));
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formName.trim()) {
      Alert.alert('Atenção', 'Nome do serviço é obrigatório');
      return;
    }

    const duration = parseInt(formDuration, 10);
    if (isNaN(duration) || duration < 5) {
      Alert.alert('Atenção', 'Duração mínima é 5 minutos');
      return;
    }

    setSaving(true);
    try {
      if (editingService) {
        await updateService(editingService.id, {
          name:         formName.trim(),
          description:  formDesc.trim() || undefined,
          duration_min: duration,
        });
        Alert.alert('Sucesso', 'Serviço atualizado!');
      } else {
        await createService({
          name:         formName.trim(),
          description:  formDesc.trim() || undefined,
          duration_min: duration,
        });
        Alert.alert('Sucesso', 'Serviço criado!');
      }
      setShowModal(false);
      loadServices();
    } catch (error: any) {
      Alert.alert('Erro', error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (service: Service) => {
    try {
      await toggleServiceActive(service.id);
      loadServices();
    } catch (error: any) {
      Alert.alert('Erro', error.message);
    }
  };

  const handleDelete = (service: Service) => {
    Alert.alert(
      'Excluir Serviço',
      `Excluir "${service.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteService(service.id);
              loadServices(); // ✅ CORRIGIDO: loadServices em vez de loadData
            } catch (error: any) {
              Alert.alert('Não foi possível excluir', error.message);
            }
          },
        },
      ]
    );
  };
  // ── render ─────────────────────────────────────────────────────────────────

  return (
    <>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.teal} />
        }
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={22} color={theme.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Serviços</Text>
          <TouchableOpacity style={styles.addBtn} onPress={openCreate}>
            <MaterialIcons name="add" size={22} color={theme.teal} />
          </TouchableOpacity>
        </View>

        {/* ── Resumo ── */}
        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={[styles.summaryValue, { color: theme.teal }]}>
              {services.filter(s => s.active).length}
            </Text>
            <Text style={styles.summaryLabel}>Ativos</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={[styles.summaryValue, { color: theme.textMuted }]}>
              {services.filter(s => !s.active).length}
            </Text>
            <Text style={styles.summaryLabel}>Inativos</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={[styles.summaryValue, { color: theme.blue }]}>
              {services.length}
            </Text>
            <Text style={styles.summaryLabel}>Total</Text>
          </View>
        </View>

        {/* ── Lista ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Todos os Serviços</Text>

          {services.length === 0 ? (
            <View style={styles.emptyCard}>
              <MaterialIcons name="medical-services" size={48} color={theme.border} />
              <Text style={styles.emptyText}>Nenhum serviço cadastrado</Text>
              <TouchableOpacity style={styles.emptyBtn} onPress={openCreate}>
                <Text style={styles.emptyBtnText}>Criar primeiro serviço</Text>
              </TouchableOpacity>
            </View>
          ) : (
            services.map((service) => (
              <View key={service.id} style={[
                styles.serviceCard,
                !service.active && styles.serviceCardInactive,
              ]}>
                <View style={styles.serviceCardLeft}>
                  <View style={[
                    styles.serviceIconBox,
                    { backgroundColor: service.active ? theme.teal + '20' : theme.border + '40' },
                  ]}>
                    <MaterialIcons
                      name="medical-services"
                      size={22}
                      color={service.active ? theme.teal : theme.textMuted}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[
                      styles.serviceName,
                      !service.active && { color: theme.textMuted },
                    ]}>
                      {service.name}
                    </Text>
                    {service.description ? (
                      <Text style={styles.serviceDesc}>{service.description}</Text>
                    ) : null}
                    <View style={styles.serviceMeta}>
                      <MaterialIcons name="access-time" size={12} color={theme.textMuted} />
                      <Text style={styles.serviceMetaText}>{service.duration_min} min</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.serviceActions}>
                  {/* Toggle ativo */}
                  <Switch
                    value={Boolean(service.active)}
                    onValueChange={() => handleToggleActive(service)}
                    trackColor={{ false: theme.border, true: theme.teal + '60' }}
                    thumbColor={service.active ? theme.teal : theme.textMuted}
                    style={{ transform: [{ scaleX: 0.85 }, { scaleY: 0.85 }] }}
                  />
                  {/* Editar */}
                  <TouchableOpacity
                    style={[styles.iconBtn, { backgroundColor: theme.blue + '15' }]}
                    onPress={() => openEdit(service)}
                  >
                    <MaterialIcons name="edit" size={16} color={theme.blue} />
                  </TouchableOpacity>
                  {/* Excluir */}
                  <TouchableOpacity
                    style={[styles.iconBtn, { backgroundColor: theme.red + '15' }]}
                    onPress={() => handleDelete(service)}
                  >
                    <MaterialIcons name="delete-outline" size={16} color={theme.red} />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ══════════════════════════════════════════
          MODAL — Criar / Editar Serviço
      ══════════════════════════════════════════ */}
      <Modal
        visible={showModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalWrapper}>
          <View style={styles.modalHeader}>
            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setShowModal(false)}>
              <MaterialIcons name="close" size={20} color={theme.textSecondary} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {editingService ? 'Editar Serviço' : 'Novo Serviço'}
            </Text>
            <View style={{ width: 36 }} />
          </View>

          <ScrollView style={styles.modalScroll} keyboardShouldPersistTaps="handled">
            {/* Nome */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nome do Serviço *</Text>
              <TextInput
                style={styles.input}
                value={formName}
                onChangeText={setFormName}
                placeholder="Ex: Consulta Clínica Geral"
                placeholderTextColor={theme.textMuted}
              />
            </View>

            {/* Descrição */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Descrição (opcional)</Text>
              <TextInput
                style={[styles.input, styles.inputMultiline]}
                value={formDesc}
                onChangeText={setFormDesc}
                placeholder="Descreva brevemente o serviço..."
                placeholderTextColor={theme.textMuted}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            {/* Duração */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Duração (minutos) *</Text>
              <TextInput
                style={styles.input}
                value={formDuration}
                onChangeText={setFormDuration}
                placeholder="30"
                placeholderTextColor={theme.textMuted}
                keyboardType="numeric"
              />
            </View>

            {/* Botões */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalSaveBtn, saving && { opacity: 0.6 }]}
                onPress={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <>
                    <MaterialIcons name="check" size={18} color="#fff" />
                    <Text style={styles.modalSaveText}>
                      {editingService ? 'Salvar' : 'Criar'}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            <View style={{ height: 40 }} />
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}