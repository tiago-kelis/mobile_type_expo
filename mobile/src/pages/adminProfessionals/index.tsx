import React, { useState, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView,
  Alert, Modal, TextInput, ActivityIndicator,
  RefreshControl, Switch,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { makeStyles } from './styles';
import { useTheme } from '../../contexts/ThemeContext';
import {
  Professional, getAllProfessionals,
  createProfessional, toggleDuty,
  toggleProfessionalActive, deleteProfessional, approveProfessional,  // ✅ novo,
} from '../../api/professionals';
import {
  Specialty, getSpecialties, createSpecialty,
} from '../../api/specialties';
import {
  Service, getAllServices,
} from '../../api/services';
import { api } from '../../api/client';

export default function AdminProfessionals() {
  const navigation = useNavigation();
  const { theme }  = useTheme();
  const styles     = makeStyles(theme);

  const [professionals, setProfessionals]         = useState<Professional[]>([]);
  const [specialties, setSpecialties]             = useState<Specialty[]>([]);
  const [allServices, setAllServices]             = useState<Service[]>([]);
  const [refreshing, setRefreshing]               = useState(false);
  const [showModal, setShowModal]                 = useState(false);
  const [showSpecialtyModal, setShowSpecialtyModal] = useState(false);

  // form profissional
  const [formName, setFormName]                   = useState('');
  const [formSpecId, setFormSpecId]               = useState<number | null>(null);
  const [formCrm, setFormCrm]                     = useState('');
  const [formServiceIds, setFormServiceIds]       = useState<number[]>([]);
  const [saving, setSaving]                       = useState(false);

  // form nova especialidade
  const [newSpecName, setNewSpecName]             = useState('');
  const [savingSpec, setSavingSpec]               = useState(false);

  // ── dados ──────────────────────────────────────────────────────────────────

  const loadData = useCallback(async () => {
    try {
      const [profs, specs, svcs] = await Promise.all([
        getAllProfessionals(),
        getSpecialties(),
        getAllServices(), // ✅ serviços existentes
      ]);
      setProfessionals(profs);
      setSpecialties(specs);
      setAllServices(svcs);
    } catch (error: any) {
      Alert.alert('Erro', error.message);
    }
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  useFocusEffect(useCallback(() => { loadData(); }, [loadData]));

  // ── especialidade ──────────────────────────────────────────────────────────

  const handleCreateSpecialty = async () => {
    if (!newSpecName.trim()) return;
    setSavingSpec(true);
    try {
      await createSpecialty(newSpecName.trim());
      setNewSpecName('');
      const specs = await getSpecialties();
      setSpecialties(specs);
      Alert.alert('Sucesso', 'Especialidade adicionada!');
    } catch (error: any) {
      Alert.alert('Erro', error.message);
    } finally {
      setSavingSpec(false);
    }
  };

  // ── profissional ───────────────────────────────────────────────────────────

  const openCreate = () => {
    setFormName('');
    setFormSpecId(specialties[0]?.id ?? null);
    setFormCrm('');
    setFormServiceIds([]);
    setShowModal(true);
  };

  // ✅ toggle serviço no form — multi-select
  const toggleServiceInForm = (serviceId: number) => {
    setFormServiceIds(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleSave = async () => {
    if (!formName.trim()) {
      Alert.alert('Atenção', 'Nome é obrigatório');
      return;
    }
    if (!formSpecId) {
      Alert.alert('Atenção', 'Selecione uma especialidade');
      return;
    }

    setSaving(true);
    try {
      await createProfessional({
        name:         formName.trim(),
        specialty_id: formSpecId,
        crm:          formCrm.trim() || undefined,
        service_ids:  formServiceIds, // ✅ serviços selecionados
      });
      Alert.alert('Sucesso', 'Profissional cadastrado!');
      setShowModal(false);
      loadData();
    } catch (error: any) {
      Alert.alert('Erro', error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleDuty = async (prof: Professional) => {
    try {
      await toggleDuty(prof.id);
      loadData();
    } catch (error: any) {
      Alert.alert('Erro', error.message);
    }
  };

  const handleToggleActive = async (prof: Professional) => {
    try {
      await toggleProfessionalActive(prof.id);
      loadData();
    } catch (error: any) {
      Alert.alert('Erro', error.message);
    }
  };

  const handleDelete = (prof: Professional) => {
    Alert.alert(
      'Excluir Profissional',
      `Excluir "${prof.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir', style: 'destructive',
          onPress: async () => {
            try {
              await deleteProfessional(prof.id);
              loadData();
            } catch (error: any) {
              Alert.alert('Erro', error.message);
            }
          },
        },
      ]
    );
  };



  // ✅ substituir o handler que usava api.patch diretamente
  const handleApproveProfessional = (prof: Professional) => {
    Alert.alert(
      'Aprovar Profissional',
      `Aprovar "${prof.name}" como profissional do sistema?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Aprovar',
          onPress: async () => {
            try {
              await approveProfessional(prof.id);
              Alert.alert('✅ Aprovado', `${prof.name} já pode fazer login como profissional.`);
              loadData();
            } catch (error: any) {
              Alert.alert('Erro', error.message);
            }
          },
        },
      ]
    );
  };

  const onDutyCount = professionals.filter(p => p.on_duty && p.active).length;
  const activeCount = professionals.filter(p => p.active).length;

  // ── render ─────────────────────────────────────────────────────────────────

  return (
    <>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.blue} />
        }
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={22} color={theme.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profissionais</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TouchableOpacity
              style={[styles.addBtn, { backgroundColor: theme.purple + '20', borderColor: theme.purple + '40' }]}
              onPress={() => setShowSpecialtyModal(true)}
            >
              <MaterialIcons name="list" size={20} color={theme.purple} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.addBtn} onPress={openCreate}>
              <MaterialIcons name="add" size={22} color={theme.blue} />
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Resumo ── */}
        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <View style={styles.summaryDot} />
            <Text style={[styles.summaryValue, { color: theme.green }]}>{onDutyCount}</Text>
            <Text style={styles.summaryLabel}>De Plantão</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={[styles.summaryValue, { color: theme.blue }]}>{activeCount}</Text>
            <Text style={styles.summaryLabel}>Ativos</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={[styles.summaryValue, { color: theme.textMuted }]}>{professionals.length}</Text>
            <Text style={styles.summaryLabel}>Total</Text>
          </View>
        </View>

        {/* ── Plantão Agora ── */}
        {onDutyCount > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Plantão Agora</Text>
            {professionals.filter(p => p.on_duty && p.active).map(prof => (
              <View key={prof.id} style={styles.dutyCard}>
                <View style={styles.dutyIndicator} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.profName}>{prof.name}</Text>
                  <Text style={styles.profSpec}>{prof.specialty}</Text>
                </View>
                <TouchableOpacity
                  style={[styles.iconBtn, { backgroundColor: theme.yellow + '20' }]}
                  onPress={() => handleToggleDuty(prof)}
                >
                  <MaterialIcons name="logout" size={16} color={theme.yellow} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* ── Lista Completa ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Todos os Profissionais</Text>

          {professionals.length === 0 ? (
            <View style={styles.emptyCard}>
              <MaterialIcons name="groups" size={48} color={theme.border} />
              <Text style={styles.emptyText}>Nenhum profissional cadastrado</Text>
              <TouchableOpacity style={styles.emptyBtn} onPress={openCreate}>
                <Text style={styles.emptyBtnText}>Cadastrar profissional</Text>
              </TouchableOpacity>
            </View>
          ) : (
            professionals.map((prof) => (
              <View key={prof.id} style={[
                styles.profCard,
                !prof.active && styles.profCardInactive,
              ]}>
                <View style={[
                  styles.profAvatar,
                  { backgroundColor: prof.on_duty ? theme.green + '20' : theme.surface },
                ]}>
                  <MaterialIcons
                    name="person"
                    size={24}
                    color={prof.on_duty ? theme.green : theme.textMuted}
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={[styles.profName, !prof.active && { color: theme.textMuted }]}>
                    {prof.name}
                  </Text>
                  <Text style={styles.profSpec}>{prof.specialty}</Text>
                  {prof.crm ? (
                    <Text style={styles.profCrm}>CRM: {prof.crm}</Text>
                  ) : null}

                  {/* ✅ serviços associados */}
                  {prof.service_names && prof.service_names.length > 0 && (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 4 }}>
                      {prof.service_names.map((name, i) => (
                        <View key={i} style={styles.serviceChip}>
                          <MaterialIcons name="medical-services" size={10} color={theme.teal} />
                          <Text style={styles.serviceChipText}>{name}</Text>
                        </View>
                      ))}
                    </ScrollView>
                  )}

                  <View style={styles.profBadgeRow}>
                    {Boolean(prof.on_duty) && (
                      <View style={[styles.badge, { backgroundColor: theme.green + '20' }]}>
                        <View style={[styles.badgeDot, { backgroundColor: theme.green }]} />
                        <Text style={[styles.badgeText, { color: theme.green }]}>Plantão</Text>
                      </View>
                    )}
                    {!prof.active && (
                      <View style={[styles.badge, { backgroundColor: theme.red + '20' }]}>
                        <Text style={[styles.badgeText, { color: theme.red }]}>Inativo</Text>
                      </View>
                    )}

                    {/* ✅ badge pendente — aprovação ainda não feita */}
                    {prof.user_id && !prof.user_approved && (
                      <View style={[styles.badge, { backgroundColor: theme.yellow + '20' }]}>
                        <View style={[styles.badgeDot, { backgroundColor: theme.yellow }]} />
                        <Text style={[styles.badgeText, { color: theme.yellow }]}>Pendente</Text>
                      </View>
                    )}
                  </View>
                </View>

                {/* ✅ botão de aprovação — só aparece para profissionais pendentes */}
                {prof.user_id && !prof.user_approved && (
                  <TouchableOpacity
                    style={[styles.iconBtn, { backgroundColor: theme.teal + '20' }]}
                    onPress={() => handleApproveProfessional(prof)}
                  >
                    <MaterialIcons name="verified" size={18} color={theme.teal} />
                  </TouchableOpacity>
                )}

                <View style={styles.profActions}>
                  <TouchableOpacity
                    style={[
                      styles.iconBtn,
                      { backgroundColor: prof.on_duty ? theme.green + '20' : theme.surface },
                    ]}
                    onPress={() => handleToggleDuty(prof)}
                  >
                    <MaterialIcons
                      name={prof.on_duty ? 'remove-circle-outline' : 'add-circle-outline'}
                      size={18}
                      color={prof.on_duty ? theme.green : theme.textMuted}
                    />
                  </TouchableOpacity>

                  <Switch
                    value={Boolean(prof.active)}
                    onValueChange={() => handleToggleActive(prof)}
                    trackColor={{ false: theme.border, true: theme.blue + '60' }}
                    thumbColor={prof.active ? theme.blue : theme.textMuted}
                    style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                  />

                  <TouchableOpacity
                    style={[styles.iconBtn, { backgroundColor: theme.red + '15' }]}
                    onPress={() => handleDelete(prof)}
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
          MODAL — Novo Profissional
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
            <Text style={styles.modalTitle}>Novo Profissional</Text>
            <View style={{ width: 36 }} />
          </View>

          <ScrollView style={styles.modalScroll} keyboardShouldPersistTaps="handled">

            {/* Nome */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nome Completo *</Text>
              <TextInput
                style={styles.input}
                value={formName}
                onChangeText={setFormName}
                placeholder="Dr. Nome Sobrenome"
                placeholderTextColor={theme.textMuted}
                autoCapitalize="words"
              />
            </View>

            {/* Especialidade */}
            <View style={styles.inputGroup}>
              <View style={styles.inputLabelRow}>
                <Text style={styles.inputLabel}>Especialidade *</Text>
                <TouchableOpacity
                  style={styles.addSpecBtn}
                  onPress={() => setShowSpecialtyModal(true)}
                >
                  <MaterialIcons name="add" size={14} color={theme.purple} />
                  <Text style={styles.addSpecBtnText}>Nova</Text>
                </TouchableOpacity>
              </View>

              {specialties.length === 0 ? (
                <TouchableOpacity
                  style={styles.emptySpecCard}
                  onPress={() => setShowSpecialtyModal(true)}
                >
                  <MaterialIcons name="add-circle-outline" size={24} color={theme.purple} />
                  <Text style={styles.emptySpecText}>
                    Nenhuma especialidade — toque para adicionar
                  </Text>
                </TouchableOpacity>
              ) : (
                <ScrollView style={styles.specList} nestedScrollEnabled>
                  {specialties.map((spec) => {
                    const selected = formSpecId === spec.id;
                    return (
                      <TouchableOpacity
                        key={spec.id}
                        style={[
                          styles.specRow,
                          selected && { borderColor: theme.blue, backgroundColor: theme.blue + '10' },
                        ]}
                        onPress={() => setFormSpecId(spec.id)}
                        activeOpacity={0.8}
                      >
                        <View style={[
                          styles.specRadio,
                          selected && { borderColor: theme.blue, backgroundColor: theme.blue },
                        ]}>
                          {selected && <View style={styles.specRadioDot} />}
                        </View>
                        <Text style={[
                          styles.specName,
                          selected && { color: theme.blue, fontWeight: '700' },
                        ]}>
                          {spec.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              )}
            </View>

            {/* CRM */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>CRM (opcional)</Text>
              <TextInput
                style={styles.input}
                value={formCrm}
                onChangeText={setFormCrm}
                placeholder="Ex: 12345/SP"
                placeholderTextColor={theme.textMuted}
                autoCapitalize="characters"
              />
            </View>

            {/* ✅ Serviços que atende — dos serviços já criados */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Serviços que atende ({formServiceIds.length} selecionado{formServiceIds.length !== 1 ? 's' : ''})
              </Text>

              {allServices.filter(s => s.active).length === 0 ? (
                <View style={styles.emptySpecCard}>
                  <MaterialIcons name="medical-services" size={24} color={theme.textMuted} />
                  <Text style={styles.emptySpecText}>
                    Nenhum serviço ativo — crie serviços primeiro na aba Serviços
                  </Text>
                </View>
              ) : (
                allServices.filter(s => s.active).map((svc) => {
                  const selected = formServiceIds.includes(svc.id);
                  return (
                    <TouchableOpacity
                      key={svc.id}
                      style={[
                        styles.specRow,
                        selected && { borderColor: theme.teal, backgroundColor: theme.teal + '10' },
                      ]}
                      onPress={() => toggleServiceInForm(svc.id)}
                      activeOpacity={0.8}
                    >
                      {/* ✅ checkbox quadrado — indica multi-select */}
                      <View style={[
                        styles.specRadio,
                        { borderRadius: 4 },
                        selected && { borderColor: theme.teal, backgroundColor: theme.teal },
                      ]}>
                        {selected && (
                          <MaterialIcons name="check" size={12} color="#fff" />
                        )}
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={[
                          styles.specName,
                          selected && { color: theme.teal, fontWeight: '700' },
                        ]}>
                          {svc.name}
                        </Text>
                        <Text style={{ fontSize: 11, color: theme.textMuted }}>
                          {svc.duration_min} min
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })
              )}
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
                    <Text style={styles.modalSaveText}>Cadastrar</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            <View style={{ height: 40 }} />
          </ScrollView>
        </View>
      </Modal>

      {/* ══════════════════════════════════════════
          MODAL — Gerenciar Especialidades
      ══════════════════════════════════════════ */}
      <Modal
        visible={showSpecialtyModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowSpecialtyModal(false)}
      >
        <View style={styles.modalWrapper}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setShowSpecialtyModal(false)}
            >
              <MaterialIcons name="close" size={20} color={theme.textSecondary} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Especialidades</Text>
            <View style={{ width: 36 }} />
          </View>

          <ScrollView style={styles.modalScroll} keyboardShouldPersistTaps="handled">
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nova Especialidade</Text>
              <View style={styles.addSpecRow}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  value={newSpecName}
                  onChangeText={setNewSpecName}
                  placeholder="Ex: Angiologia"
                  placeholderTextColor={theme.textMuted}
                  autoCapitalize="words"
                />
                <TouchableOpacity
                  style={[
                    styles.addSpecConfirmBtn,
                    (!newSpecName.trim() || savingSpec) && { opacity: 0.5 },
                  ]}
                  onPress={handleCreateSpecialty}
                  disabled={!newSpecName.trim() || savingSpec}
                >
                  {savingSpec ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <MaterialIcons name="add" size={20} color="#fff" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <Text style={styles.inputLabel}>
              Cadastradas ({specialties.length})
            </Text>
            {specialties.map((spec) => (
              <View key={spec.id} style={styles.specListRow}>
                <MaterialIcons name="local-hospital" size={16} color={theme.teal} />
                <Text style={styles.specListName}>{spec.name}</Text>
              </View>
            ))}

            <View style={{ height: 40 }} />
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}